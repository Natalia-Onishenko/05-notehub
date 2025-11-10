import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginate from 'react-paginate';
import { fetchMovies, type TMDBSearchResponse } from '../../services/movieService';

import type { Movie } from '../../types/movie';
import css from './App.module.css';

function App() {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isFetching, isSuccess } = useQuery<TMDBSearchResponse>({
    queryKey: ['movies', query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: !!query,
    placeholderData: (prev) => prev,
  });

  
 useEffect(() => {
  if (isSuccess && data?.results.length === 0) {
    toast.error('No movies found for your request.');
  }
}, [isSuccess, data]);

  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      toast.error('Please enter your search query.');
      return;
    }
    setQuery(trimmed);
    setCurrentPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />

      {isLoading || isFetching ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
      ) : (
        <>
          {isSuccess && data?.results.length ? (
                <>
                   {data.total_pages > 1 && (
                <ReactPaginate
                  pageCount={data.total_pages}
                  pageRangeDisplayed={5}
                  marginPagesDisplayed={1}
                  onPageChange={handlePageChange}
                  forcePage={currentPage - 1}
                  containerClassName={css.pagination}
                  activeClassName={css.active}
                  nextLabel="→"
                  previousLabel="←"
                />
              )}
              <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
             
            </>
          ) : null}
        </>
      )}

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleModalClose} />}
    </div>
  );
}

export default App;