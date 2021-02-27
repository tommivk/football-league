import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  allVenues: {
    name: string;
    country: string;
    id: number;
  }[];
}

const NewTeamForm: React.FC<Props> = ({ allVenues }) => {
  const [name, setName] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [venueId, setVenueId] = useState<string | null>(null);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const newTeam = {
        name,
        country,
        homeVenueId: Number(venueId),
      };

      await axios.post('http://localhost:8000/api/teams', newTeam);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      Add new team
      <form onSubmit={handleFormSubmit}>
        <input
          placeholder="name"
          onChange={({ target }) => setName(target.value)}
        ></input>
        <input
          placeholder="country"
          onChange={({ target }) => setCountry(target.value)}
        ></input>
        <select onChange={({ target }) => setVenueId(target.value)}>
          {allVenues.map((venue) => (
            <option value={venue.id} key={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default NewTeamForm;
