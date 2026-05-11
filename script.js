// script.js

const movies = [
  {
    title: "Interstellar",
    language: "Hindi Dubbed",
    poster: "https://via.placeholder.com/300x450?text=Interstellar",
    video: "YOUR_MOVIE_LINK_HERE"
  },

  {
    title: "Naruto",
    language: "Japanese",
    poster: "https://via.placeholder.com/300x450?text=Naruto",
    video: "YOUR_MOVIE_LINK_HERE"
  },

  {
    title: "Your Name",
    language: "English Dubbed",
    poster: "https://via.placeholder.com/300x450?text=Your+Name",
    video: "YOUR_MOVIE_LINK_HERE"
  }
];

const movieContainer = document.getElementById("movieContainer");
const searchBar = document.getElementById("searchBar");

const popup = document.getElementById("popup");
const popupPoster = document.getElementById("popupPoster");
const popupTitle = document.getElementById("popupTitle");
const popupLanguage = document.getElementById("popupLanguage");
const popupSource = document.getElementById("popupSource");
const popupVideo = document.getElementById("popupVideo");
const closeBtn = document.getElementById("closeBtn");

function displayMovies(movieList) {

  movieContainer.innerHTML = "";

  movieList.forEach(movie => {

    const movieCard = document.createElement("div");

    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}">

      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>${movie.language}</p>
      </div>
    `;

    movieCard.addEventListener("click", () => {
      openPopup(movie);
    });

    movieContainer.appendChild(movieCard);
  });
}

function openPopup(movie) {

  popup.style.display = "flex";

  popupPoster.src = movie.poster;
  popupTitle.textContent = movie.title;
  popupLanguage.textContent = movie.language;

  popupSource.src = movie.video;

  popupVideo.load();
}

closeBtn.addEventListener("click", () => {

  popup.style.display = "none";

  popupVideo.pause();
});

window.addEventListener("click", (e) => {

  if (e.target === popup) {

    popup.style.display = "none";

    popupVideo.pause();
  }
});

searchBar.addEventListener("input", () => {

  const searchText = searchBar.value.toLowerCase();

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchText)
  );

  displayMovies(filteredMovies);
});

displayMovies(movies);
