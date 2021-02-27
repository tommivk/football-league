import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import './index.css';
import LeagueTable from './components/LeagueTable';
import NewVenueForm from './components/NewVenueForm';
import NewTeamForm from './components/NewTeamForm';
import NewPlayerForm from './components/NewPlayerForm';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';

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
  }, [user]);

  const handleLogOut = () => {
    localStorage.removeItem('loggedFootballLeagueUser');
    setUser(null);
  }

  return (
    <div>
      {user && 
      <div>
      Logged in as {user.username}
      <button onClick={() => handleLogOut()}>Logout</button>
      </div>
      }
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
      <NewVenueForm />
      <NewTeamForm allVenues={allVenues} />
      <NewPlayerForm allTeams={allTeams} />
      <LoginForm setUser={setUser} />
      <SignUpForm />
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
