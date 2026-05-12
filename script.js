const API_KEY = "90280f39";

const movieContainer =
  document.getElementById("movieContainer");

const searchBar =
  document.getElementById("searchBar");


// POPUP

const popup =
  document.getElementById("popup");

const popupContent =
  document.getElementById("popupContent");


// FETCH MOVIES

async function fetchMovies(search = "Kannada") {

  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`
  );

  const data = await response.json();

  if (data.Search) {

    // CHECK KANNADA DUB STATUS

    const moviesWithDubStatus =
      await Promise.all(

        data.Search.map(async (movie) => {

          const {
            data: dbMovie
          } =
            await supabaseClient
              .from("movies")
              .select("kannada_dub")
              .eq("imdb_id", movie.imdbID)
              .single();


          return {
            ...movie,
            kannada_dub:
              dbMovie?.kannada_dub || false
          };
        })
      );


    // PRIORITIZE KANNADA DUBBED

    moviesWithDubStatus.sort((a, b) => {

      if (
        a.kannada_dub &&
        !b.kannada_dub
      ) {
        return -1;
      }

      if (
        !a.kannada_dub &&
        b.kannada_dub
      ) {
        return 1;
      }

      return 0;
    });


    displayMovies(moviesWithDubStatus);

  } else {

    movieContainer.innerHTML =
      "<h2>No movies found.</h2>";
  }
}


// DISPLAY MOVIES

function displayMovies(movies) {

  movieContainer.innerHTML = "";

  movies.forEach(movie => {

    const movieCard =
      document.createElement("div");

    movieCard.classList.add("movie-card");


    // HANDLE POSTERS

    const poster =
      movie.Poster !== "N/A"
        ? movie.Poster
        : "";


    movieCard.innerHTML = `

      ${
        poster
          ? `<img src="${poster}" alt="${movie.Title}">`
          : ""
      }

      <div class="movie-info">

        <h2>${movie.Title}</h2>

        <p>
          📅 ${movie.Year}
        </p>

        <p>

          ${
            movie.kannada_dub
              ? "🟢 Kannada Dub Available"
              : "🔴 Kannada Dub Not Available"
          }

        </p>

        <button
          onclick="fetchMovieDetails('${movie.imdbID}')"
        >
          View Details
        </button>

      </div>
    `;

    movieContainer.appendChild(movieCard);
  });
}


// FETCH FULL DETAILS

async function fetchMovieDetails(id) {

  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
  );

  const movie = await response.json();

  openPopup(movie);
}


// OPEN POPUP

async function openPopup(movie) {

  popup.style.display = "flex";


  // CHECK DATABASE

  const {
    data: dbMovie
  } =
    await supabaseClient
      .from("movies")
      .select("*")
      .eq("imdb_id", movie.imdbID)
      .single();


  const kannadaDub =
    dbMovie?.kannada_dub || false;


  const poster =
    movie.Poster !== "N/A"
      ? `<img src="${movie.Poster}" alt="${movie.Title}">`
      : "";


  popupContent.innerHTML = `

    <span
      class="close-btn"
      onclick="closePopup()"
    >
      &times;
    </span>

    ${poster}

    <h1>${movie.Title}</h1>

    <p>
      ⭐ IMDb Rating:
      ${movie.imdbRating}
    </p>

    <p>
      🎭 Genre:
      ${movie.Genre}
    </p>

    <p>
      🌐 Language:
      ${movie.Language}
    </p>

    <p>
      ⏱ Runtime:
      ${movie.Runtime}
    </p>

    <p>
      🎬 Director:
      ${movie.Director}
    </p>

    <p>
      👥 Actors:
      ${movie.Actors}
    </p>

    <p>
      📖 ${movie.Plot}
    </p>

    <p>

      ${
        kannadaDub
          ? "🟢 Kannada Dub Available"
          : "🔴 Kannada Dub Not Available"
      }

    </p>


    <button
      onclick="watchMovie('${movie.imdbID}')"
    >
      Watch
    </button>

  `;
}


// WATCH MOVIE

async function watchMovie(imdbID) {

  const {
    data,
    error
  } =
    await supabaseClient
      .from("movies")
      .select("*")
      .eq("imdb_id", imdbID)
      .single();


  // MOVIE NOT AVAILABLE

  if (!data || error) {

    popupContent.innerHTML = `

      <span
        class="close-btn"
        onclick="closePopup()"
      >
        &times;
      </span>

      <h1>
        Movie Isn't Available
      </h1>

      <p>
        Please request to add.
      </p>

    `;

    return;
  }


  // STREAM MOVIE

  popupContent.innerHTML = `

    <span
      class="close-btn"
      onclick="closePopup()"
    >
      &times;
    </span>

    <h1>${data.title}</h1>

    <video
      controls
      autoplay
      width="100%"
    >

      <source
        src="${data.video_url}"
        type="video/mp4"
      >

    </video>

  `;
}


// CLOSE POPUP

function closePopup() {

  popup.style.display = "none";
}


// SEARCH

searchBar.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {

    fetchMovies(searchBar.value);
  }
});


// DEFAULT SEARCH

fetchMovies();
