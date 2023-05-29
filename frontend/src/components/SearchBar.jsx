import { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const API_URL = "https://api.gimnasio.neatly.es/api";

  const handleQueryChange = async (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    const authToken = getAuthToken();
    const response = await fetch(`${API_URL}/members/search?name=${newQuery}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await response.json();
    onSearch(data);
  };

  const handleClearClick = () => {
    setQuery('');
    onSearch([]);
  };

  return (
    <div className="relative w-full md:w-[25%] md:mt-6 mt-4">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="w-5 h-5 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </span>

      <input
        type="text"
        value={query}
        onChange={handleQueryChange}
        className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
        placeholder="Buscar por nombre"
      />

      {query && (
        <button
          type="button"
          onClick={handleClearClick}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <svg
            className="w-4 h-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm2-4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
