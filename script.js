const API_KEY = "90280f39";

const movieContainer = document.getElementById("movieContainer");
const searchBar = document.getElementById("searchBar");

// Popup Elements
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popupContent");


// Fetch Movies
async function fetchMovies(search = "Kannada") {

  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`
  );

  const data = await response.json();

  if (data.Search) {
    displayMovies(data.Search);
  } else {
    movieContainer.innerHTML =
      "<h2>No movies found.</h2>";
  }
}


// Display Movies
function displayMovies(movies) {

  movieContainer.innerHTML = "";

  movies.forEach(movie => {

    const movieCard = document.createElement("div");

    movieCard.classList.add("movie-card");

    // Handle missing posters
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

        <button onclick="fetchMovieDetails('${movie.imdbID}')">
          View Details
        </button>

      </div>
    `;

    movieContainer.appendChild(movieCard);
  });
}


// Fetch Full Movie Details
async function fetchMovieDetails(id) {

  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
  );

  const movie = await response.json();

  openPopup(movie);
}


// Open Popup
function openPopup(movie) {

  popup.style.display = "flex";

  const poster =
    movie.Poster !== "N/A"
      ? `<img src="${movie.Poster}" alt="${movie.Title}">`
      : "";

  popupContent.innerHTML = `

    <span class="close-btn" onclick="closePopup()">
      &times;
    </span>

    ${poster}

    <h1>${movie.Title}</h1>

    <p>
      ⭐ IMDb Rating: ${movie.imdbRating}
    </p>

    <p>
      🎭 Genre: ${movie.Genre}
    </p>

    <p>
      🌐 Language: ${movie.Language}
    </p>

    <p>
      ⏱ Runtime: ${movie.Runtime}
    </p>

    <p>
      🎬 Director: ${movie.Director}
    </p>

    <p>
      👥 Actors: ${movie.Actors}
    </p>

    <p>
      📖 ${movie.Plot}
    </p>

  `;
}


// Close Popup
function closePopup() {
  popup.style.display = "none";
}


// Search
searchBar.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {

    fetchMovies(searchBar.value);
  }
});


// Default Search
fetchMovies();
