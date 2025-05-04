import { isDev } from "../env";

export const TIMETABLE_KEY = "ttg_timetable";
export const LECTURERS_KEY = "ttg_lecturers";
export const PROGRAMMES_KEY = "ttg_programmes";
export const ROUTE_GUARD_KEY = "ttg_can_view"

export const API_URL = isDev ? "http://127.0.0.1:5000/api" : "/api";

export const CONTRIBUTORS: Contributor[] = [
  { name: "Kamogelo Selepe", role: "Project Lead" },
  { name: "Nobuhle Ndlovu", role: "Backend Developer" },
  { name: "Thendo A Munyai", role: "Frontend & Backend Developer" },
  { name: "Njabulo Zulu", role: "Documentation & Research" },
];

export * from "./mockData";
