const fixturesRouter = require('express').Router();
const pool = require('../pool');

import { Request, Response } from 'express';

fixturesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { homeTeamId, awayTeamId, venueId, gameDate } = req.body;
    await pool.query(
      'INSERT INTO fixtures (home_team_id, away_team_id, venue_id, game_date, home_score, away_score, finished) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [homeTeamId, awayTeamId, venueId, gameDate, 0, 0, false]
    );
    return res.status(200).end();
  } catch (error) {
    return console.log(error);
  }
});

fixturesRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM fixtures');
    res.status(200).json(rows);
  } catch (error) {
    return console.log(error);
  }
});

fixturesRouter.get('/upcoming', async (_req: Request, res: Response) => {
  try {
    const dateNow = new Date().toUTCString();

    const {
      rows,
    } = await pool.query(
      'SELECT fixtures.id, game_date, venues.name as venue_name, venues.country as venue_country, home.name as home_team, away.name as away_team FROM fixtures JOIN venues ON venue_id = venues.id JOIN teams as home ON home_team_id = home.id JOIN teams as away ON away_team_id = away.id WHERE game_date > $1 AND finished = false ORDER BY game_date',
      [dateNow]
    );

    return res.status(200).json(rows);
  } catch (error) {
    return console.log(error);
  }
});

fixturesRouter.get('/finished', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      "SELECT fixtures.id, game_date, away_score, home_score, away_team.name as away_team, home_team.name as home_team, CASE WHEN home_score > away_score THEN '1' WHEN away_score > home_score THEN '2' WHEN away_score = home_score THEN 'X' END AS result FROM fixtures JOIN teams as home_team ON home_team.id = home_team_id JOIN teams as away_team ON away_team_id = away_team.id WHERE finished = true ORDER BY game_date"
    );
    return res.status(200).json(rows);
  } catch (error) {
    return res.send(error.message);
  }
});

fixturesRouter.get('/ongoing', async (_req: Request, res: Response) => {
  try {
    const dateNow = new Date().toISOString();
    const {
      rows,
    } = await pool.query(
      'SELECT fixtures.id, game_date, home_score, away_score, home_team.name as home_team, away_team.name as away_team FROM fixtures JOIN teams as away_team ON away_team.id = away_team_id JOIN teams as home_team ON home_team.id = home_team_id WHERE finished=false AND game_date <= $1',
      [dateNow]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.send(error.message);
  }
});

fixturesRouter.get('/table', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT team_id as id, N as name, SUM(G) as goals FROM ((SELECT fixtures.home_team_id as team_id, (SELECT name FROM teams WHERE teams.id = fixtures.home_team_id) as N, fixtures.home_score as G FROM fixtures WHERE finished = true) UNION ALL (SELECT fixtures.away_team_id as team_id, (SELECT name FROM teams WHERE teams.id = fixtures.away_team_id) as N, fixtures.away_score as G FROM fixtures WHERE finished = true)) as t GROUP BY team_id, N ORDER BY goals DESC'
    );

    return res.status(200).send(rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

fixturesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT * FROM fixtures WHERE id = $1', [
      req.params.id,
    ]);
    res.status(200).send(rows[0]);
  } catch (error) {
    console.log(error);
  }
});

fixturesRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const {
      homeTeamId,
      awayTeamId,
      venueId,
      gameDate,
      homeScore,
      awayScore,
      finished,
    } = req.body;

    await pool.query(
      'UPDATE fixtures SET home_team_id = $1, away_team_id = $2, venue_id = $3, game_date = $4, home_score = $5, away_score = $6, finished = $7 WHERE id = $8',
      [
        homeTeamId,
        awayTeamId,
        venueId,
        gameDate,
        homeScore,
        awayScore,
        finished,
        req.params.id,
      ]
    );

    res.status(200).end();
  } catch (error) {
    console.log(error);
  }
});

fixturesRouter.get('/:id/goals', async (req: Request, res: Response) => {
  try {
    const {
      rows,
    } = await pool.query('SELECT * FROM goals WHERE fixture_id = $1', [
      req.params.id,
    ]);
    res.status(200).send(rows);
  } catch (error) {
    console.log(error);
  }
});

module.exports = fixturesRouter;
