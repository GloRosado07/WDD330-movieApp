const apiUrl = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=abc582637d3875d794a252c56fddfda9';
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const localMoviesUrl = 'js/localMovies.json';

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");



// Calling the api.
showMovies(apiUrl);
// Fetching data from the api then looping over each item to create html elements that store our movies.
function showMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      data.results.forEach((element) => {
        // Creating elements for each movie.
        const card = document.createElement("div");
        card.classList.add("card");

        const cardInner = document.createElement("div");
        cardInner.classList.add("card-inner");

        const cardFront = document.createElement("div");
        cardFront.classList.add("card-front");

        const cardBack = document.createElement("div");
        cardBack.classList.add("card-back");

        const image = document.createElement("img");
        image.classList.add("poster");
        image.src = IMGPATH + element.poster_path;

        const title = document.createElement("h2");
        title.classList.add("title");
        title.innerHTML = element.title;

        const synopsis = document.createElement("p");
        synopsis.classList.add("synopsis");
        synopsis.innerHTML = element.overview;

        // Appending children.
        cardFront.appendChild(image);
        cardBack.appendChild(title);
        cardBack.appendChild(synopsis);

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);

        card.appendChild(cardInner);

        main.appendChild(card);
      });
    });
}

// Debounce function implementation
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}

// Searching for movies using a search api by calling the showMovies function.
// form.addEventListener("submit", (e) => {
//     e.preventDefault();
//     main.innerHTML = ''; 

     
    const searchTerm = search.value;

    if (searchTerm) {
        showMovies(SEARCHAPI + searchTerm);
        search.value = "";
    }



    const searchResultsContainer = document.getElementById("search-results");

    search.addEventListener("input", debounce(handleSearch, 300));

    
    function handleSearch() {
      const searchTerm = search.value.trim();
    
      if (searchTerm) {
        fetch(SEARCHAPI + searchTerm)
          .then((res) => res.json())
          .then((data) => {
            const searchResults = data.results.slice(0, 5); // Limit the number of suggestions to display
            displaySearchResults(searchResults);
          })
          .catch((error) => {
            console.log("Error:", error);
          });
      } else {
        clearSearchResults();
      }
    }
    
    function displaySearchResults(results) {
      clearSearchResults();
    
      results.forEach((result) => {
        const suggestion = document.createElement("div");
        suggestion.classList.add("suggestion");
        suggestion.textContent = result.title;
        suggestion.addEventListener("click", () => {
          search.value = result.title;
          clearSearchResults();
          showMovies(SEARCHAPI + result.title);
        });
    
        searchResultsContainer.appendChild(suggestion);
      });
    }
    
    function clearSearchResults() {
      searchResultsContainer.innerHTML = "";
    }
    
    // Calling the api and fetching local JSON
    Promise.all([fetch(apiUrl).then(res => res.json()), fetch(localMoviesUrl).then(res => res.json())])
      .then(function([apiData, localData]) {
        const mergedData = apiData.results.concat(localData);
    
        mergedData.forEach(element => {
          // Creating elements for each movie.
          const el = document.createElement('div');
          const image = document.createElement('img');
          const text = document.createElement('h2');
          text.innerHTML = element.title;
          image.src = IMGPATH + element.poster_path;
          // Appending children.
          el.appendChild(image);
          el.appendChild(text);
          main.appendChild(el);
        });
      })
      .catch(error => {
        console.log("Error:", error);
      });   
      
      
// Define an array to store the favorite movies
let favoriteMovies = [];

// Function to handle the "Add Movie" button click event
function handleAddMovie() {
  // Get the current movie title from the search input field
  const movieTitle = search.value.trim();

  // Check if the movie title is not empty and it's not already in the favorite list
  if (movieTitle && !favoriteMovies.includes(movieTitle)) {
    favoriteMovies.push(movieTitle); // Add the movie title to the favorite list
    saveFavorites(); // Save the updated favorites to Local Storage
    console.log("Movie added to favorites:", movieTitle);
  } else {
    console.log("Movie is already in favorites or the title is empty.");
  }
}

// Function to save favorites to Local Storage
function saveFavorites() {
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
}

// Function to retrieve favorites from Local Storage
function retrieveFavorites() {
  const storedFavorites = localStorage.getItem('favoriteMovies');
  if (storedFavorites) {
    favoriteMovies = JSON.parse(storedFavorites);
  }
}

// Add event listener to the "Add Movie" button
const addMovieBtn = document.getElementById("add-movie-btn");
addMovieBtn.addEventListener("click", handleAddMovie);

// Call the retrieveFavorites function to load favorites from Local Storage on page load
retrieveFavorites();


// Function to toggle the flip animation class
function toggleFlip() {
  this.classList.toggle('flipped');
}

// Adding event listener for the card click event
main.addEventListener('click', function (event) {
  const card = event.target.closest('.card');
  if (card) {
    card.addEventListener('animationend', toggleFlip);
    card.classList.add('flipping');
  }
});

// Function to display favorite movies
function displayFavoriteMovies() {
  const favoriteMoviesContainer = document.getElementById("favorite-movies");
  favoriteMoviesContainer.innerHTML = "";

  favoriteMovies.forEach(movieTitle => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("favorite-movie");
    movieElement.textContent = movieTitle;

    favoriteMoviesContainer.appendChild(movieElement);
  });
}

// Function to handle the "Add Movie" button click event
function handleAddMovie() {
  // Get the current movie title from the search input field
  const movieTitle = search.value.trim();

  // Check if the movie title is not empty and it's not already in the favorite list
  if (movieTitle && !favoriteMovies.includes(movieTitle)) {
    favoriteMovies.push(movieTitle); // Add the movie title to the favorite list
    saveFavorites(); // Save the updated favorites to Local Storage
    console.log("Movie added to favorites:", movieTitle);

    // Display the updated favorite movies
    displayFavoriteMovies();
  } else {
    console.log("Movie is already in favorites or the title is empty.");
  }
}

// Call the retrieveFavorites function to load favorites from Local Storage on page load
retrieveFavorites();

// Display the favorite movies on page load
displayFavoriteMovies();

// Function to remove a movie from the favorite list
function removeMovieFromFavorites(movieTitle) {
  const movieIndex = favoriteMovies.indexOf(movieTitle);
  if (movieIndex !== -1) {
    favoriteMovies.splice(movieIndex, 1); // Remove the movie from the favorite list
    saveFavorites(); // Save the updated favorites to Local Storage
    console.log("Movie removed from favorites:", movieTitle);

    // Display the updated favorite movies
    displayFavoriteMovies();
  }
}

// Function to create the remove button for a favorite movie
function createRemoveButton(movieTitle) {
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-button");
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    removeMovieFromFavorites(movieTitle);
  });

  return removeButton;
}

// Function to display favorite movies
function displayFavoriteMovies() {
  const favoriteMoviesContainer = document.getElementById("favorite-movies");
  favoriteMoviesContainer.innerHTML = "";

  favoriteMovies.forEach(movieTitle => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("favorite-movie");
    movieElement.textContent = movieTitle;

    const removeButton = createRemoveButton(movieTitle);
    movieElement.appendChild(removeButton);

    favoriteMoviesContainer.appendChild(movieElement);
  });
}


// Function to toggle the flip animation class
function toggleFlip() {
  this.classList.toggle('flipped');
}

// Adding event listener for the card click event
main.addEventListener('click', function (event) {
  const card = event.target.closest('.card');
  if (card) {
    card.classList.toggle('flipped');
  }
});

