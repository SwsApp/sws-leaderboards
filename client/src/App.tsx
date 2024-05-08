import { useEffect, useRef, useState, useMemo } from "react";
import logo from "./logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState, leaderboardsActions } from "./redux";
import { motion, usePresence, AnimatePresence } from "framer-motion";
import "./App.css";
import { AppDispatch } from "./redux";

const PAGE_LENGTH = 10;

function App() {
  const dispatch: AppDispatch = useDispatch();
  const canWakeLock = () => "wakeLock" in navigator;
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [switchCounter, setSwitchCounter] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const leaderboards = useSelector(
    (x: RootState) => x.leaderboards.leaderboards
  );

  const getLeaderBoards = (pageLength: number) => {
    if (leaderboards.length <= pageLength) return leaderboards;
    else {
      //let index = Math.floor(leaderboards.length / 2);
      //if()
      let currentIndex = switchCounter * pageLength;
      let lastIndex = switchCounter * pageLength + pageLength;
      setCurrentIndex(currentIndex);
      if (leaderboards.length <= lastIndex) {
        lastIndex = leaderboards.length;
        // setLastIndex(lastIndex);
        // setSwitchCounter(0);
        setTimeout(() => {
          setSwitchCounter(0);
        }, 20000);
        return leaderboards.slice(currentIndex);
      }
      return leaderboards.slice(currentIndex, lastIndex);
    }
  };

  const leaderboardsMain = useMemo(
    () => getLeaderBoards(PAGE_LENGTH),
    [switchCounter, leaderboards]
  );

  useEffect(() => {
    let switchInterval = setInterval(() => {
      setSwitchCounter((prev) => prev + 1);
    }, 30000);

    if (
      leaderboards.length > 0 &&
      leaderboards.length <= PAGE_LENGTH &&
      switchInterval
    )
      clearInterval(switchInterval);
    return () => {
      if (switchInterval) clearInterval(switchInterval);
    };
  }, []);

  const transition = {
    type: "spring",
    stiffness: 50,
    damping: 10,
    mass: 0.4,
  };

  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    dispatch(leaderboardsActions.getLeaderboardsWeekly());
    dispatch(leaderboardsActions.getLeaderboardsDaily());

    let interval = setInterval(() => {
      dispatch(leaderboardsActions.getLeaderboardsWeekly());
      dispatch(leaderboardsActions.getLeaderboardsDaily());
    }, 120000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    async function lockWakeCall() {
      try {
        await lockWakeState();
      } catch (e) {
        console.error("Failed to lock wake state with reason:", e);
      }
    }
    if (!wakeLock) lockWakeCall();
    if (wakeLock) {
      setTimeout(releaseWakeState, 60000);
    }
  }, [wakeLock]);

  const animations = {
    layout: true,
    initial: "out",
    animate: isPresent ? "in" : "out",
    whileTap: "tapped",
    variants: {
      out: { scale: 0, opacity: 0, zIndex: -1 },
      in: { scale: 1, opacity: 1, transition: { duration: 1 } },
    },
    transition,
  };

  function releaseWakeState() {
    if (wakeLock) wakeLock.release();
    setWakeLock(null);
  }

  async function lockWakeState() {
    if (!canWakeLock()) return;
    try {
      let wl = await navigator.wakeLock.request("screen");
      console.info(wl, "Wl");
      setWakeLock(wl);
    } catch (e) {
      console.error("Failed to lock wake state with reason:", e);
    }
  }
  console.info(switchCounter, "switch");
  return (
    <div className="max-h-full h-screen mx-10 flex justify-center py-12 lg:px-2 font-mono overflow-y-auto">
      <div className="flex flex-col">
        <div className="overflow-x-auto w-screen sm:-mx-6 lg:-mx-3.5">
          <div className="inline-block w-full  py-2 sm:px-6 lg:px-8">
            <table
              className={`w-full text-left text-4xl font-light text-slate-300 lg:text-8xl overflow-hidden`}
            >
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 xl:py-6 2xl:py-8 flex flex-row items-center xl:text-2xl"
                  >
                    <span>User</span>

                    {/* <svg
                      className="h-10 w-10 mr-8 ml-4 text-blue-500 cursor-pointer"
                      onClick={() => setToggleModal(true)}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      {" "}
                      <circle cx="12" cy="12" r="10" />{" "}
                      <line x1="12" y1="8" x2="12" y2="16" />{" "}
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg> */}
                  </th>

                  <th scope="col" className="px-6 py-4 text-center text-2xl">
                    total calls
                    <br />
                    (daily)
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-2xl">
                    total calls
                    <br />
                    (weekly)
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {leaderboardsMain?.map((v, i) => {
                    if (v.id === 10 || v.id === 999999) return null;
                    return (
                      <motion.tr
                        {...animations}
                        key={v.id}
                        className={`${
                          i === 0 ? "bg-neutral-600" : ""
                        } border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600`}
                      >
                        <td className="whitespace-nowrap px-6 py-4 xl:py-6 2xl:py-5">
                          <div className="flex flex-row items-center">
                            {/* <Avatar
                              fullName={v.name!!}
                              url={v.photo ?? ""}
                              className="rounded-full w-10 xl:w-14  border-4 border-gray-300 mr-6"
                            />{" "} */}
                            <p>
                              {currentIndex + i + 1} {v.name?.split(" ")[0]}{" "}
                              {v.name?.split(" ")[1]?.[0]}
                            </p>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          {v.totalActivitiesDaily ?? "--"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          {v.totalActivitiesWeekly ?? "--"}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
