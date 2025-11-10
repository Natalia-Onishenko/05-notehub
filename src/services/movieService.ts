import axios, { type AxiosResponse } from 'axios';
import type { Movie } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN as string}`,
  },
});


export interface TMDBSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}


export async function fetchMovies(query: string, page = 1): Promise<TMDBSearchResponse> {
  if (!query) return { page: 1, results: [], total_pages: 0, total_results: 0 };

  const params = {
    query,
    include_adult: false,
    language: 'en-US',
    page,
  };

  const response: AxiosResponse<TMDBSearchResponse> = await api.get('/search/movie', { params });

  return response.data;
}