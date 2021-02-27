import React, { useState } from 'react';
import axios from 'axios';

const SignUpForm = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const newUser = {
        username,
        password,
      };
      await axios.post('http://localhost:8000/api/users', newUser);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div>
        Sign up
      <form onSubmit={handleFormSubmit}>
        <input
          placeholder="username"
          onChange={({ target }) => setUsername(target.value)}
        ></input>
        <input
          placeholder="password"
          type="password"
          onChange={({ target }) => setPassword(target.value)}
        ></input>
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
