import { periodEnum } from "../redux/slices/leaderoards.slice";

export interface activeUsersData {
  id: number;
  name?: string;
  photo?: string;
  email?: string;
}

export interface LeaderboardsData extends activeUsersData {
  totalActivitiesWeekly?: number;
  totalActivitiesDaily?: number;
}

export interface leaderBoardType {
  emp_name: string;
  emp_code: number;
  emp_country_code: string;
  emp_number: number;
  emp_tags: [];
  total_incoming_calls: number;
  total_incoming_duration: number;
  total_incoming_connected_calls: number;
  total_outgoing_calls: number;
  total_outgoing_duration: number;
  total_outgoing_connected_calls: number;
  total_missed_calls: number;
  total_rejected_calls: number;
  total_calls: number;
  total_duration: number;
  total_connected_calls: number;
  total_never_attended_calls: number;
  total_not_pickup_by_clients_calls: number;
  total_unique_clients: number;
  total_working_hours: string;
}
