require('dotenv').config()

const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());

const venuesRouter = require('./controllers/venues');
const playersRouter = require('./controllers/players');
const teamsRouter = require('./controllers/teams');
const fixturesRouter = require('./controllers/fixtures');
const goalsRouter = require('./controllers/goals');

const PORT = 8000;

app.use(express.json());
app.use('/api/venues', venuesRouter);
app.use('/api/players', playersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/fixtures', fixturesRouter);
app.use('/api/goals', goalsRouter);

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
});