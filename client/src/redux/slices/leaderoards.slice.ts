import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { LeaderboardsData, leaderBoardType } from "../../constants/types";
import { RootState } from "..";

// import { history, fetchWrapper } from '_helpers';
export type periodEnum =
  | "TODAY"
  | "YESTERDAY"
  | "LAST_WEEK"
  | "LAST_MONTH"
  | "CURRENT_WEEK";
interface leaderboardsState {
  leaderboards: Array<LeaderboardsData>;
  isError: boolean;
  error: string | null;
  loading: boolean;
}

// create slice

const name = "leaderboards";
const API_URL = "http://localhost:4000"; // "https://api1.callyzer.co/api//v2/call-log/"; // "http://localhost:8080"; //
const initialState: leaderboardsState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const leaderboardsActions = { ...slice.actions, ...extraActions };
export const leaderboardsReducer = slice.reducer;

// implementation

function createInitialState(): leaderboardsState {
  return {
    leaderboards: [],
    // initialize state from local storage to enable user to stay logged in
    isError: false,
    error: null,
    loading: false,
  };
}

function createReducers() {
  return {
    setError,
    setPeriod,
  };

  function setPeriod(
    state: leaderboardsState,
    action: { payload: periodEnum; type: string }
  ) {
    // state.period = state.period === "CURRENT_WEEK" ? "TODAY" : "CURRENT_WEEK";
  }

  function setError(state: leaderboardsState) {
    state.leaderboards = [];
    localStorage.removeItem("token");
    // history.navigate('/login');
  }
}

function createExtraActions() {
  return {
    getLeaderboardsWeekly: getLeaderboardsWeekly(),
    getLeaderboardsDaily: getLeaderboardsDaily(),
  };

  function getLeaderboardsWeekly() {
    return createAsyncThunk(
      `${name}/getWeekly`,
      async (undefined, { getState }) => {
        const state = getState() as RootState;

        return await axios.get(`${API_URL}/leaderboards_weekly`);
      }
    );
  }

  function getLeaderboardsDaily() {
    return createAsyncThunk(
      `${name}/getDaily`,
      async (undefined, { getState }) => {
        const state = getState() as RootState;

        return await axios.get(`${API_URL}/leaderboards_daily`);
      }
    );
  }
}

function createExtraReducers() {
  return {
    ...leaderboardsWeeklyResponse(),
    ...leaderboardsDailyResponse(),
  };

  function leaderboardsWeeklyResponse() {
    const { pending, fulfilled, rejected }: any =
      extraActions.getLeaderboardsWeekly;
    return {
      [pending]: (state: leaderboardsState) => {
        state.isError = false;
        state.loading = true;
      },
      [fulfilled]: (
        state: leaderboardsState,
        action: PayloadAction<
          { data: { result: Array<leaderBoardType> }; status: number },
          string
        >
      ) => {
        console.info(action, " ---user active data");
        // state.leaderboards = action.payload.data.data;
        // state.userMetaInfo = action.payload.data.meta;
        // state.slug = action.payload.data.meta.slug ?? "yodha";
        if (
          action?.payload?.data &&
          action.payload.status === 200 &&
          action?.payload.data?.result.length > 0
        ) {
          let oldData =
            state.leaderboards?.length > 0 ? [...state.leaderboards] : [];

          let DATA: Array<LeaderboardsData> = action?.payload.data.result.map(
            (v) => {
              return {
                id: v.emp_number,
                name: v.emp_name,
                totalActivitiesWeekly: v.total_calls,
              };
            }
          );

          for (let index = 0; index < oldData.length; index++) {
            let ind = DATA.findIndex((v) => v.id === oldData[index].id);
            if (ind >= 0)
              DATA[ind].totalActivitiesDaily =
                oldData[index].totalActivitiesDaily;
          }

          state.leaderboards = DATA.sort(
            (a, b) => b.totalActivitiesDaily! - a.totalActivitiesDaily!
          );
          state.loading = false;
          state.isError = false;
        } else {
          state.isError = true;
          state.error = "Failed to load the leaderboards Weekly!!";
        }
        state.loading = false;
      },
      [rejected]: (state: leaderboardsState) => {
        state.isError = true;
        state.loading = false;
      },
    };
  }

  function leaderboardsDailyResponse() {
    const { pending, fulfilled, rejected }: any =
      extraActions.getLeaderboardsDaily;
    return {
      [pending]: (state: leaderboardsState) => {
        state.isError = false;
        state.loading = true;
      },
      [fulfilled]: (
        state: leaderboardsState,
        action: PayloadAction<
          { data: { result: Array<leaderBoardType> }; status: number },
          string
        >
      ) => {
        console.info(action, " ---user active data");
        // state.leaderboards = action.payload.data.data;
        // state.userMetaInfo = action.payload.data.meta;
        // state.slug = action.payload.data.meta.slug ?? "yodha";
        if (
          action?.payload?.data &&
          action.payload.status === 200 &&
          action?.payload.data?.result.length > 0
        ) {
          let oldData =
            state.leaderboards?.length > 0 ? [...state.leaderboards] : [];

          let DATA: Array<LeaderboardsData> = action?.payload.data.result.map(
            (v) => {
              return {
                id: v.emp_number,
                name: v.emp_name,
                totalActivitiesDaily: v.total_calls,
              };
            }
          );

          for (let index = 0; index < oldData.length; index++) {
            let ind = DATA.findIndex((v) => v.id === oldData[index].id);
            if (ind >= 0)
              DATA[ind].totalActivitiesWeekly =
                oldData[index].totalActivitiesWeekly;
          }

          state.leaderboards = DATA.sort(
            (a, b) => b.totalActivitiesDaily! - a.totalActivitiesDaily!
          );
          state.loading = false;
          state.isError = false;
        } else {
          state.isError = true;
          state.error = "Failed to load the leaderboards Weekly!!";
        }
        state.loading = false;
      },
      [rejected]: (state: leaderboardsState) => {
        state.isError = true;
        state.loading = false;
      },
    };
  }
}

export const userInfoSelector = (state: any) => state.leaderboards.userMetaInfo;
export const leaderboardLoading = (state: {
  leaderboards: leaderboardsState;
}) => state.leaderboards.loading;
