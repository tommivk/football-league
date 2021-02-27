import React, { useState, Dispatch, SetStateAction } from 'react';
import axios from 'axios';

type User = {
  username: string,
  token: string,
  id: number,
}

interface Props {
  setUser: Dispatch<SetStateAction<User | null>>;
}

const LoginForm: React.FC<Props> = ({ setUser }) => {
  const [username, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const credentials = {
        username,
        password,
      };

      const response = await axios.post(
        'http://localhost:8000/api/login',
        credentials
      );

      setUser(response.data);
      localStorage.setItem('loggedFootballLeagueUser', JSON.stringify(response.data));
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          placeholder="name"
          onChange={({ target }) => setUserName(target.value)}
        ></input>
        <input
          placeholder="password"
          type="password"
          onChange={({ target }) => setPassword(target.value)}
        ></input>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
