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

async function fetchMovies(search = "") {

  movieContainer.innerHTML =
    "<h2>Loading...</h2>";


  // RANDOM SEARCH TERMS

  const randomSearches = [

    "Hindi",
    "Kannada",
    "Tamil",
    "Telugu",
    "Malayalam",

    "Bollywood",
    "Tollywood",
    "Kollywood",

    "Action",
    "Comedy",
    "Drama",
    "Sci-Fi",
    "Adventure",
    "Thriller",

    "Anime",
    "Marvel",
    "DC",
    "Naruto",
    "One Piece"

  ];


  // RANDOM HOMEPAGE CONTENT

  if (search === "") {

    search =
      randomSearches[
        Math.floor(
          Math.random() *
          randomSearches.length
        )
      ];
  }


  // FETCH MULTIPLE PAGES

  let allMovies = [];


  for (let page = 1; page <= 5; page++) {

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}&page=${page}`
    );

    const data = await response.json();

    if (data.Search) {

      allMovies = [

        ...allMovies,
        ...data.Search

      ];
    }
  }


  // REMOVE DUPLICATES

  const uniqueMovies =
    allMovies.filter(
      (movie, index, self) =>

        index === self.findIndex(
          m => m.imdbID === movie.imdbID
        )
    );


  // RANDOMIZE ORDER

  uniqueMovies.sort(
    () => Math.random() - 0.5
  );


  // PRIORITIZE INDIAN MOVIES

  uniqueMovies.sort((a, b) => {

    function isIndian(title) {

      const indianKeywords = [

        "hindi",
        "kannada",
        "telugu",
        "tamil",
        "malayalam",

        "bollywood",
        "tollywood",
        "kollywood",

        "kgf",
        "kantara",
        "pushpa",
        "rrr",
        "bahubali"

      ];

      title = title.toLowerCase();

      return indianKeywords.some(
        keyword =>
          title.includes(keyword)
      );
    }


    if (
      isIndian(a.Title) &&
      !isIndian(b.Title)
    ) {
      return -1;
    }

    if (
      !isIndian(a.Title) &&
      isIndian(b.Title)
    ) {
      return 1;
    }

    return 0;
  });


  // DISPLAY MOVIES

  if (uniqueMovies.length > 0) {

    displayMovies(uniqueMovies);

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


    // POSTER

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

        <button
          class="watch-btn"
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

function openPopup(movie) {

  popup.style.display = "flex";


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

    <button
      class="watch-btn"
      onclick="watchMovie('${movie.imdbID}')"
    >
      ▶ Watch Now
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
      style="
        margin-top:20px;
        border-radius:12px;
        background:black;
      "
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


// DEFAULT HOMEPAGE

fetchMovies("");
