const goalsRouter = require('express').Router();
const pool = require('../pool');

import { Request, Response } from 'express';

goalsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM goals');
    res.status(200).json(rows);
  } catch (error) {
    return console.log(error);
  }
});

goalsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { fixtureId, playerId, date } = req.body;

    await pool.query(
      'INSERT INTO goals (fixture_id, player_id, date) VALUES ($1, $2, $3)',
      [fixtureId, playerId, date]
    );

    res.status(200).end();
  } catch (error) {
    return console.log(error);
  }
});

module.exports = goalsRouter;
