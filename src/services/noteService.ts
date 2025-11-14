import axios from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const { data } = await axios.get<FetchNotesResponse>(BASE_URL, { params });
  return data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  const { data } = await axios.post<Note>(BASE_URL, note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await axios.delete<Note>(`${BASE_URL}/${id}`);
  return data;
};