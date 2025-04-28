
export interface User {
  id: string;
  username: string;
  role: "admin" | "reception";
  full_name: string;
}

export interface Visitor {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  id_type: "passport" | "nationalId" | "driverLicense" | "other";
  id_number: string;
  photo?: string;
  visit_purpose: string;
  person_to_visit: string;
  check_in_time: Date;
  check_out_time?: Date;
  is_checked_out: boolean;
  created_by?: string;
}

export interface DashboardStats {
  currentVisitors: number;
  todayVisitors: number;
  weekVisitors: number;
  monthVisitors: number;
}
