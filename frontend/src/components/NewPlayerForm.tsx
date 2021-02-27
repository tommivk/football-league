import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  allTeams: {
    id: number;
    name: string;
    country: string;
    home_venue_id: string;
  }[];
}

const positions = [
  'GK',
  'SW',
  'LB',
  'LCB',
  'CB',
  'RCB',
  'RB',
  'LWB',
  'LDM',
  'CDM',
  'RDM',
  'LM',
  'LCM',
  'CM',
  'RCM',
  'RM',
  'LAM',
  'CAM',
  'RAM',
  'LW',
  'CF',
  'RW',
  'LS',
  'ST',
  'RS',
];

const kitNumbers = Array.from(Array(100).keys()).slice(1);

const NewPlayerForm: React.FC<Props> = ({ allTeams }) => {
  const [name, setName] = useState<string>('');
  const [teamId, setTeamId] = useState<string | null>(null);
  const [kitNumber, setKitNumber] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const newPlayer = {
        name,
        teamId: Number(teamId),
        position,
        kitNumber: Number(kitNumber),
      };

      await axios.post('http://localhost:8000/api/players', newPlayer);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      Add new player
      <form onSubmit={handleFormSubmit}>
        <input
          placeholder="name"
          onChange={({ target }) => setName(target.value)}
        ></input>
        <select onChange={({ target }) => setTeamId(target.value)}>
          {allTeams.map((team) => (
            <option value={team.id} key={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <select onChange={({ target }) => setPosition(target.value)}>
          {positions.map((pos) => (
            <option value={pos} key={pos}>
              {pos}
            </option>
          ))}
        </select>
        <select onChange={({ target }) => setKitNumber(target.value)}>
          {kitNumbers.map((num) => (
            <option key={num}>{num}</option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default NewPlayerForm;
