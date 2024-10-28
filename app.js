const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server Running at http://localhost:3001/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//API 1
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `select * from movie;`;

  const getMovies = await db.all(getMoviesQuery);
  response.send(getMovies);
});

//API 2
app.post("/movies/", async (request, response) => {
  const addMovieDetails = request.body;
  const { directorId, movieName, leadActor } = addMovieDetails;
  const movieDetailsQuery = `insert into movie (director_id, movie_name,lead_actor) values (${directorId}, '${movieName}', '${leadActor}');`;
  await db.run(movieDetailsQuery);
  response.send("movie Successfully Added");
});

//API 3
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `select * from movie where movie_id = ${movieId};`;
  const movieDetails = await db.get(getMovieQuery);
  response.send(movieDetails);
});

//API 4
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const updateMovieDetails = request.body;
  const { directorId, movieName, leadActor } = updateMovieDetails;
  const updateMovieDetailsQuery = `update movie set director_id = ${directorId}, movie_name = '${movieName}', lead_actor ='${leadActor}' where movie_id  = ${movieId};`;
  await db.run(updateMovieDetailsQuery);
  response.send("Movie Details Updated");
});

//API 5
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `delete from movie where movie_id = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Deleted from Database");
});

//API 6
app.get("/directors/", async (request, response) => {
  const getDirectorQuery = `select * from director;`;
  const directorDetails = await db.all(getDirectorQuery);
  response.send(directorDetails);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorQuery = `select * from movie where director_id = ${directorId};`;
  const directorDetails = await db.all(getDirectorQuery);
  response.send(directorDetails);
});
