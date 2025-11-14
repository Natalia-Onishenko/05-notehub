import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

import css from "./App.module.css";

const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const perPage = 12;

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, perPage, search),
    placeholderData: (prev) =>
      prev ?? { notes: [], totalPages: 1 },
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>

        <SearchBox onSearch={debouncedSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page - 1}
            onPageChange={(p) => setPage(p + 1)}
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
        <NoteList notes={data.notes} />
      )}

      {data && data.notes.length === 0 && !isLoading && (
        <p>No notes found</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default App;