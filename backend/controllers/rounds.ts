const roundsRouter = require('express').Router();
const pool = require('../pool');

import { Request, Response } from 'express';

roundsRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { round } = req.body;
        await pool.query('INSERT INTO rounds (round, finished) VALUES ($1, $2)', [round, false]);
        return res.status(200).end();
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

roundsRouter.get('/', async (_req: Request, res: Response) => {
    try {
        const { rows } = await pool.query('SELECT * FROM rounds');
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

roundsRouter.get('/:id/fixtures', async (req: Request, res: Response) => {
    try {
        const { rows } = await pool.query('SELECT game_date, away_team.name as away_team, home_team.name as home_team, home_score, away_score, venue.name, round, fixtures.finished FROM fixtures JOIN teams as home_team ON home_team_id = home_team.id JOIN teams as away_team ON away_team.id = away_team_id JOIN rounds ON round_id = rounds.id JOIN venues as venue ON venue_id = venue.id WHERE round_id = $1', [req.params.id]);
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

module.exports = roundsRouter;
