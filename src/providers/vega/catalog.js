// catalog.js
// Vega provider catalog and genres

export const catalog = [
  { title: "Popular Movies", filter: "/filter?type=movie&sort=imdb" },
  { title: "Latest Movies", filter: "/filter?type=movie&sort=latest" },
  { title: "Popular TV Shows", filter: "/filter?type=tv&sort=imdb" },
  { title: "Latest TV Shows", filter: "/filter?type=tv&sort=latest" },
];

export const genres = [
  { title: "Action", filter: "/filter?genre=10&type=movie" },
  { title: "Comedy", filter: "/filter?genre=7&type=movie" },
  { title: "Horror", filter: "/filter?genre=14&type=movie" },
  { title: "Romance", filter: "/filter?genre=12&type=movie" },
  { title: "Drama", filter: "/filter?genre=18&type=movie" },
  { title: "Adventure", filter: "/filter?genre=2&type=movie" },
  { title: "Animation", filter: "/filter?genre=3&type=movie" },
  { title: "Crime", filter: "/filter?genre=5&type=movie" },
  { title: "Fantasy", filter: "/filter?genre=9&type=movie" },
  { title: "Mystery", filter: "/filter?genre=11&type=movie" },
  { title: "Sci-Fi", filter: "/filter?genre=8&type=movie" },
  { title: "Thriller", filter: "/filter?genre=13&type=movie" },
];