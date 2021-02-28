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
  }, [user]);

  const handleLogOut = () => {
    localStorage.removeItem('loggedFootballLeagueUser');
    setUser(null);
  };

  return (
    <div>
      <Router>
        <Switch>
          <Route path="/login">
            <Header />
            <LoginForm setUser={setUser} />
          </Route>
          <Route path="/table">
            <Header />
            <LeagueTable leagueData={leagueData} />
          </Route>
          <Route path="/fixtures">
            <Header />
            <h2>upcoming</h2>
            <ul>
              {upcomingMatches.map((match) => (
                <li key={match.id}>
                  <div>
                    {match.home_team} - {match.away_team} {match.venue_name}{' '}
                    {match.game_date}
                  </div>
                </li>
              ))}
            </ul>
          </Route>
          <Route path="/admin">
            <Header />
            <NewVenueForm />
            <NewTeamForm allVenues={allVenues} />
            <NewPlayerForm allTeams={allTeams} />
          </Route>
          <Route path="/signup">
            <Header />
            <SignUpForm />
          </Route>
          <Route path="/">
            <Header />
            {user && (
              <div>
                Logged in as {user.username}
                <button onClick={() => handleLogOut()}>Logout</button>
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
            Upcoming
            <ul>
              {upcomingMatches.map((match) => (
                <li key={match.id}>
                  <div>
                    {match.home_team} - {match.away_team} {match.venue_name}{' '}
                    {match.game_date}
                  </div>
                </li>
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
