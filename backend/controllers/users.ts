const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const pool = require('../pool');

import { Request, Response } from 'express';

usersRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT id, username, admin FROM users');
    return res.status(200).send(rows);
  } catch (error) {
    return console.log(error);
  }
});

usersRouter.get('/:id/predictions', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM predictions where user_id = $1', [req.params.id]);
    return res.status(200).send(rows);
  } catch (error) {
    return console.log(error);
  }
});

usersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).end();
    }

    const usernameExists = await pool.query(
      'SELECT exists (SELECT 1 FROM users WHERE username=$1)',
      [username]
    );

    if (!usernameExists.rows[0].exists) {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const admin = false;

      await pool.query(
        'INSERT INTO users (username, password_hash, admin) VALUES ($1, $2, $3)',
        [username, passwordHash, admin]
      );

      return res.status(200).end();
    }
    return res.status(400).send({ message: 'Username is taken' });
  } catch (error) {
    return console.log(error);
  }
});

module.exports = usersRouter;
