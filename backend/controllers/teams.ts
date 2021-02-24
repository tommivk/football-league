const teamsRouter = require('express').Router();
const pool = require('../pool');

import { Request, Response } from 'express';

teamsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM teams');

    res.status(200).send(rows);
  } catch (error) {
    return console.log(error);
  }
});

teamsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, country, homeVenueId } = req.body;

    await pool.query(
      'INSERT INTO teams (name, country, home_venue_id) VALUES ($1, $2, $3)',
      [name, country, homeVenueId]
    );

    res.status(200).end();
  } catch (error) {
    return console.log(error);
  }
});

module.exports = teamsRouter;
