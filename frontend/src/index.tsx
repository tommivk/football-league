import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import './index.css';

interface Props {
  leagueData: {
    name: string,
    goals: string,
    id: number,
  }[]
}

const LeagueTable: React.FC<Props> = ( { leagueData }) => {
  return(
    <div>
      <table>
        <tbody>
          <th>Team</th>
          <th>Goals</th>
          {leagueData.map((d) => (
            <tr>
              <td>{d.name}</td>
              <td>{d.goals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [leagueData, setLeagueData] = useState<[]>([]);
  const [allTeams, setAllTeams] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/fixtures/table').then((res) => setLeagueData(res.data))
    axios.get('http://localhost:8000/api/teams').then((res) => setAllTeams(res.data));
  },[])

  return(
    <div>
      <LeagueTable leagueData = {leagueData} />
      <ul>
        {allTeams.map((team) => (
          <li>
            {team.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
