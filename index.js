const sqlite = require('sqlite'),
      Sequelize = require('sequelize'),
      request = require('request'),
      express = require('express'),
      app = express();

      const sequelize = new Sequelize(
        'database', 'username', 'password', {
        host: 'localhost',
        dialect: 'sqlite',

        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        },

        // SQLite only
        storage: './db/database.db'
      });

const { PORT=3000, NODE_ENV='development', DB_PATH='./db/database.db' } = process.env;

// START SERVER
Promise.resolve()
  .then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch((err) => { if (NODE_ENV === 'development') console.error(err.stack); });

// ROUTES
app.get('/films/:id/recommendations', getFilmRecommendations);

// ROUTE HANDLER
function getFilmRecommendations(req, res) {
    sequelize.query(`SELECT * FROM films WHERE genre_id = (
      SELECT genre_id FROM films WHERE id = ${req.params.id})
      AND release_date > (
      SELECT release_date FROM films WHERE id = ${req.params.id})
      ORDER BY id LIMIT 3`  ,

      { type: sequelize.QueryTypes.SELECT})

  .then(films => {
    console.log('this is console.log for req. params: ', req.params)
    console.log('this is console.log for genre_id: ', films[0].genre_id)
    console.log('films dot release date: ', parseInt(films[0].release_date) + 15)
    request(`http://credentials-api.generalassemb.ly/4576f55f-c427-4cfc-a11c-5bfe914ca6c1?films=${req.params.id}`, function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log(`this is how many reviews movie ${req.params.id} has` , JSON.parse(body)[0].reviews.length);
      console.log('this is console.log films: ', films)
      res.send({recommendations: films, meta: films.length})

    })

  })

}

module.exports = app;
