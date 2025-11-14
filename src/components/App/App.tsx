import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { fetchNotes, deleteNote } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import css from "./App.module.css";

const App: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const perPage = 12;


  const debouncedSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1); // reset page on search
  }, 500);


  const { data, isLoading, isError, refetch } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, perPage, search),
    placeholderData: (prev) =>
      prev ?? { notes: [], totalNotes: 0, totalPages: 1 },
  });

 
  useEffect(() => {
    if (data && page > data.totalPages) {
      setPage(data.totalPages);
    }
  }, [data, page]);

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    refetch();
  };

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage + 1);
  };

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    refetch();
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={debouncedSearchChange} />

        {/* PAGINATION ON TOP */}
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page - 1}
            onPageChange={handlePageChange}
          />
        )}

        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}

      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      )}

      {data && data.notes.length === 0 && !isLoading && (
        <p>No notes found</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onSubmit={handleCreateSuccess} />
        </Modal>
      )}
    </div>
  );
};

export default App;