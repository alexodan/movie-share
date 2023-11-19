import "./App.module.css";

import { useEffect, useState } from "react";

import viteLogo from "/vite.svg";

import reactLogo from "./assets/react.svg";
import { API_TOKEN } from "./movies/api";
import { MovieResponse, PopularMoviesResponse } from "./movies/model";

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
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {movies.map((movie, index) => {
          return (
            <div key={index}>
              <h1>{movie.title}</h1>
              <h2>Overview</h2>
              <p>{movie.overview}</p>
              <p>Release Date: {movie.release_date}</p>
              <p>Vote Average: {movie.vote_average}</p>
              <p>Popularity: {movie.popularity}</p>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
