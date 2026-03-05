export interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
  overview: string;
  genreIds: number[];
}

export interface TriviaFact {
  title: string;
  explanation: string;
}

export interface TriviaResponse {
  facts: TriviaFact[];
  cached: boolean;
}

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

// TMDB genre ID mapping
export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

// Genre filter options for the UI
export const GENRE_FILTERS = [
  { id: 0, name: 'All' },
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 16, name: 'Animation' },
  { id: 10749, name: 'Romance' },
  { id: 53, name: 'Thriller' },
  { id: 12, name: 'Adventure' },
  { id: 14, name: 'Fantasy' },
];
