const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

let db = null;
const dbPath = path.join(__dirname, "moviesData.db");
const app = express();
app.use(express.json());

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (e) {
    console.log(`Db error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertDBObjectToResponseObject = (DBObject) => {
  return {
    movieId: DBObject.movie_id,
    directorId: DBObject.director_id,
    movieName: DBObject.movie_name,
    leadActor: DBObject.lead_actor,
  };
};

const convertDirectorDBObjectToResponseObject = (DBObject) => {
  return {
    directorId: DBObject.director_id,
    directorName: DBObject.director_Name,
  };
};

app.get("/movies/", async (request, response) => {
  const getMovieDetailsQuery = `
    SELECT 
    * 
    FROM 
    movie`;
  const movieDetailsArray = await db.all(getMovieDetailsQuery);
  response.send(
    movieDetailsArray.map((eachMovie) => ({ movieName: eachMovie.movie_name }))
  );
});

app.get("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  let getMovieQuery = `
    SELECT 
    * 
    FROM 
    movie
    WHERE 
    movie_id = ${movieId}`;
  const movie = await db.get(getMovieQuery);
  response.send(convertDBObjectToResponseObject(movie));
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;

  const postMovieQuery = `
    INSERT INTO
    movie(director_id,movie_name,lead_actor)
    VALUES
    (${directorId} ,'${movieName}' , '${leadActor}');`;
  const movieResponse = await run.db(postMovieQuery);

  response.send("Success");
});

app.put("movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const updateMovieQuery = `
    UPDATE 
    movie
    SET
    director_id = ${directorID}
    movieName = '${movieName}',
    leadActor = '${leadActor}' 
    WHERE
    movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("movie updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  let { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE 
    FROM 
    movie
    WHERE 
    movie_id = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});
module.exports = app;
