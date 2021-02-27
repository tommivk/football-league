const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../pool');

import { Request, Response } from 'express';

loginRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).end();
    }

    const user = await pool.query('SELECT * from users WHERE username = $1', [
      username,
    ]);

    if (!user.rows[0]) {
      return res.status(400).send({ message: 'Username not found' });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!passwordCorrect) {
      return res.status(401).send({ message: 'Wrong credentials' });
    }

    const userForToken = {
      username: user.rows[0].username,
      id: user.rows[0].id,
    };

    const token = await jwt.sign(userForToken, process.env.SECRET);

    return res.status(200).send({
      ...userForToken,
      token,
    });
  } catch (error) {
    return console.log(error);
  }
});

module.exports = loginRouter;
