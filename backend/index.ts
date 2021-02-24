require('dotenv').config()
const express = require('express');
const app = express();

const venuesRouter = require('./controllers/venues');
const teamsRouter = require('./controllers/teams');

const PORT = 8000;

app.use(express.json());
app.use('/api/venues', venuesRouter);
app.use('/api/teams', teamsRouter);

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`)
});