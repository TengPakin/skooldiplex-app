import data from "@/data/movies.json";

export type Showtime = { time: string; hall: string; format: string };

export type Movie = {
  id: string;
  title: string;
  titleTh: string;
  genre: string;
  genreTh: string;
  year: number;
  rating: number;
  durationMin: number;
  ageRating: string;
  status: "now" | "soon";
  releaseDate?: string;
  tagline: string;
  synopsis: string;
  art: { from: string; to: string; glow: string };
  formats: string[];
  showtimes: Showtime[];
};

export const movies = data as Movie[];
export const nowShowing = movies.filter((m) => m.status === "now");
export const comingSoon = movies.filter((m) => m.status === "soon");

export const runtime = (min: number) => `${Math.floor(min / 60)}h ${min % 60}m`;
export const getMovie = (id: string) => movies.find((m) => m.id === id);

/** Branches a booking can be made at (selection step). */
export type Branch = { id: string; name: string; nameTh: string; area: string };
export const branches: Branch[] = [
  { id: "centralworld", name: "CentralWorld", nameTh: "เซ็นทรัลเวิลด์", area: "ปทุมวัน" },
  { id: "emsphere", name: "EmSphere", nameTh: "เอ็มสเฟียร์", area: "สุขุมวิท" },
  { id: "megabangna", name: "Mega Bangna", nameTh: "เมกาบางนา", area: "บางนา" },
  { id: "iconsiam", name: "ICONSIAM", nameTh: "ไอคอนสยาม", area: "คลองสาน" },
  { id: "ladprao", name: "Central Ladprao", nameTh: "เซ็นทรัลลาดพร้าว", area: "จตุจักร" },
];
export const getBranch = (id: string) => branches.find((b) => b.id === id) ?? branches[0];

/** Date chips for the selection step (prototype: fixed week of 5 Jun). */
export type DateChip = { id: string; dow: string; day: string };
export const dateChips: DateChip[] = [
  { id: "d0", dow: "วันนี้", day: "5" },
  { id: "d1", dow: "พรุ่งนี้", day: "6" },
  { id: "d2", dow: "อา.", day: "7" },
  { id: "d3", dow: "จ.", day: "8" },
  { id: "d4", dow: "อ.", day: "9" },
];
