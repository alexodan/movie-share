import "./App.module.css";

import { useEffect, useState } from "react";

import viteLogo from "/vite.svg";

import reactLogo from "./assets/react.svg";
import { API_TOKEN } from "./movies/api";
import { MovieResponse, PopularMoviesResponse } from "./movies/model";
import { MoviesTable } from "./movies/MoviesTable";

function App() {
  const [movies, setMovies] = useState<MovieResponse[]>([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    })
      .then(res => res.json())
      .then(data => data as PopularMoviesResponse)
      .then(json => {
        setMovies(json.results);
      });
  }, []);

  return (
    <main className="dark bg-background text-primary">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <MoviesTable movies={movies} />
    </main>
  );
}

export default App;
