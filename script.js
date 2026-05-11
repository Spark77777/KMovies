const API_KEY = "90280f39";

const movieContainer = document.getElementById("movieContainer");
const searchBar = document.getElementById("searchBar");

async function fetchMovies(search = "Kannada") {

  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`
  );

  const data = await response.json();

  if (data.Search) {
    displayMovies(data.Search);
  }
}

function displayMovies(movies) {

  movieContainer.innerHTML = "";

  movies.forEach(movie => {

    const movieCard = document.createElement("div");

    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
      <img src="${movie.Poster}" alt="${movie.Title}">

      <div class="movie-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
      </div>
    `;

    movieContainer.appendChild(movieCard);
  });
}

searchBar.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {

    fetchMovies(searchBar.value);
  }
});

fetchMovies();
