const playersRouter = require('express').Router();
const pool = require('../pool');

import { Request, Response } from 'express';

playersRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM players');
    return res.status(200).send(rows);
  } catch (error) {
    return console.log(error);
  }
});

playersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, teamId, position, kit_number } = req.body;

    await pool.query(
      'INSERT INTO players (team_id, name, position, kit_number) VALUES ($1, $2, $3, $4)',
      [teamId, name, position, kit_number]
    );

    return res.status(200).end();
  } catch (error) {
    return console.log(error);
  }
});

module.exports = playersRouter;
