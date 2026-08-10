export interface Session {
  subject: string;
  teacherName: string;
  datetime: string;
  status: "Upcoming" | "Confirmed" | "Completed";
}