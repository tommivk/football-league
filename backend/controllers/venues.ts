const venuesRouter = require('express').Router();
const pool = require('../pool');

import { Request, Response } from 'express';

venuesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, country } = req.body;

    await pool.query('INSERT INTO venues (name, country) VALUES ($1, $2)', [
      name,
      country,
    ]);

    return res.status(200).send(`New venue ${name} added`);
  } catch (error) {
    return console.log(error);
  }
});

venuesRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM venues');
    return res.status(200).send(rows);
  } catch (error) {
    return console.log(error);
  }
});

venuesRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, country } = req.body;
    await pool.query(
      'UPDATE venues SET name = $1, country = $2 WHERE id = $3',
      [name, country, req.params.id]
    );
    res.status(200).end();
  } catch (error) {
    return console.log(error);
  }
});

venuesRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM venues WHERE id = $1', [req.params.id]);
    res.status(204).end();
  } catch (error) {
    return console.log(error);
  }
});

module.exports = venuesRouter;
