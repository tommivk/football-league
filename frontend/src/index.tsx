import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import ReactDOM from 'react-dom';
import './index.css';
import LeagueTable from './components/LeagueTable';
import NewVenueForm from './components/NewVenueForm';
import NewTeamForm from './components/NewTeamForm';
import NewPlayerForm from './components/NewPlayerForm';
import SignUpForm from './components/SignUpForm';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import Rounds from './components/Rounds';

type User = {
  username: string;
  token: string;
  id: number;
};

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [leagueData, setLeagueData] = useState<[]>([]);
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [allVenues, setAllVenues] = useState<any[]>([]);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [finishedMatches, setFinishedMatches] = useState<any[]>([]);
  const [ongoingMatches, setOngoingMatches] = useState<any[]>([]);
  const [usersPredictions, setUsersPredictions] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      const storageItem = localStorage.getItem('loggedFootballLeagueUser');
      if (storageItem) {
        setUser(JSON.parse(storageItem));
      }
    }

    axios
      .get('http://localhost:8000/api/fixtures/table')
      .then((res) => setLeagueData(res.data));

    axios
      .get('http://localhost:8000/api/teams')
      .then((res) => setAllTeams(res.data));

    axios
      .get('http://localhost:8000/api/venues')
      .then((res) => setAllVenues(res.data));

    axios
      .get('http://localhost:8000/api/players')
      .then((res) => setAllPlayers(res.data));

    axios
      .get('http://localhost:8000/api/fixtures/upcoming')
      .then((res) => setUpcomingMatches(res.data));

    axios
      .get('http://localhost:8000/api/fixtures/finished')
      .then((res) => setFinishedMatches(res.data));

    axios
      .get('http://localhost:8000/api/fixtures/ongoing')
      .then((res) => setOngoingMatches(res.data));

    if (user) {
      axios
        .get(`http://localhost:8000/api/users/${user.id}/predictions`)
        .then((res) => setUsersPredictions(res.data));
    }
  }, [user]);

  const handleNewPrediction = async (fixtureId:number, prediction:string) => {
    if(!user) return
    const newPrediction = {
      userId: user.id,
      prediction,
    }
    try {
      const response = await axios.post(`http://localhost:8000/api/fixtures/${fixtureId}/predictions`, newPrediction)
      setUsersPredictions(usersPredictions.concat(response.data))
    } catch (error) {
      console.log('error');
    }
  };

  const getPrediction = (matchId:number) => {
    return usersPredictions.find((p) => p.fixture_id === matchId);
  }

  return (
    <div>
      <Router>
        <Switch>
          <Route path="/login">
            <Header user={user} setUser={setUser} />
            <LoginForm setUser={setUser} />
          </Route>
          <Route path="/rounds">
            <Header user={user} setUser={setUser} />
            <Rounds />
          </Route>
          <Route path="/table">
            <Header user={user} setUser={setUser} />
            <LeagueTable leagueData={leagueData} />
          </Route>
          <Route path="/fixtures">
            <Header user={user} setUser={setUser} />
            <h2>Upcoming</h2>
            <ul>
              {upcomingMatches.map((match) => (
                <li key={match.id}>
                  <div>
                    {match.home_team} - {match.away_team} {match.venue_name}{' '}
                    {match.game_date}
                    {!getPrediction(match.id) ?
                    <div>
                      <button onClick={()=> handleNewPrediction(match.id, '1')}>1</button>
                      <button onClick={()=> handleNewPrediction(match.id, 'X')}>X</button>
                      <button onClick={()=> handleNewPrediction(match.id, '2')}>2</button>
                    </div>
                    : <div>
                      my prediction {' '}
                      {getPrediction(match.id).prediction}
                      </div>
                    }   
                  </div>
                </li>
              ))}
            </ul>

            <h2>Ongoing</h2>
            <ul>
              {ongoingMatches.map((match) => (
                <li key={match.id}>
                  <div>
                    {match.home_team} - {match.away_team} {match.game_date}
                  </div>
                </li>
              ))}
            </ul>

            <h2>Finished</h2>
            <ul>
              {finishedMatches.map((match) => (
                <li key={match.id}>
                  <div>
                    {match.home_team} - {match.away_team}
                    Result: {match.result}
                  </div>
                </li>
              ))}
            </ul>
          </Route>
          <Route path="/admin">
            <Header user={user} setUser={setUser} />
            <NewVenueForm />
            <NewTeamForm allVenues={allVenues} />
            <NewPlayerForm allTeams={allTeams} />
          </Route>
          <Route path="/signup">
            <Header user={user} setUser={setUser} />
            <SignUpForm />
          </Route>
          <Route path="/">
            <Header user={user} setUser={setUser} />
            {user && (
              <div>
                Logged in as {user.username}
              </div>
            )}
            <LeagueTable leagueData={leagueData} />
            Teams
            <ul>
              {allTeams.map((team) => (
                <li key={team.id}>{team.name}</li>
              ))}
            </ul>
            Venues
            <ul>
              {allVenues.map((venue) => (
                <li key={venue.id}>{venue.name}</li>
              ))}
            </ul>
            Players
            <ul>
              {allPlayers.map((player) => (
                <li key={player.id}>{player.name}</li>
              ))}
            </ul>
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
