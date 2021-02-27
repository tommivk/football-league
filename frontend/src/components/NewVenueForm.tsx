import React, { useState } from 'react';
import axios from 'axios';

const NewVenueForm = () => {
  const [name, setName] = useState<string>('');
  const [country, setCountry] = useState<string>('');

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const venue = {
        name,
        country,
      };

      await axios.post('http://localhost:8000/api/venues', venue);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      Add new venue
      <form onSubmit={handleFormSubmit}>
        <input
          placeholder="name"
          onChange={({ target }) => setName(target.value)}
        ></input>
        <input
          placeholder="country"
          onChange={({ target }) => setCountry(target.value)}
        ></input>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default NewVenueForm;
