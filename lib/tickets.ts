import data from "@/data/tickets.json";
import { getMovie, type Movie } from "@/lib/movies";

export type Ticket = {
  id: string;
  movieId: string;
  branch: string;
  hall: string;
  format: string;
  date?: string;
  dateFull: string;
  time: string;
  seats: string[];
  code?: string;
};

export type TicketWithMovie = Ticket & { movie: Movie | undefined };

const join = (t: Ticket): TicketWithMovie => ({ ...t, movie: getMovie(t.movieId) });

export const upcomingTickets: TicketWithMovie[] = (data.upcoming as Ticket[]).map(join);
export const pastTickets: TicketWithMovie[] = (data.past as Ticket[]).map(join);
