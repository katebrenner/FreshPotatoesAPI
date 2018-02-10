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
  sequelize.query("SELECT * FROM `films`", { type: sequelize.QueryTypes.SELECT})
  .then(films => {
    res.send(films)
    // We don't need spread here, since only the results will be returned for select queries
  })
  // request(`http://credentials-api.generalassemb.ly/4576f55f-c427-4cfc-a11c-5bfe914ca6c1?films=${req.params.id}`, function (error, response, body) {
  //   // console.log('error:', error); // Print the error if one occurred
  //   // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //   console.log('body:', body);
  //   res.send(body) // Print the HTML for the Google homepage.
  // })
  // res.status(500).send('Not Implemented');

}

module.exports = app;
