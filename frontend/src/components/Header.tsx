import React, { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

type User = {
  username: string;
  token: string;
  id: number;
};

interface Props {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const Header: React.FC<Props> = ({ user, setUser }) => {
  const handleLogOut = () => {
    localStorage.removeItem('loggedFootballLeagueUser');
    setUser(null);
  };

  return (
    <div className="header">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/fixtures">Fixtures</Link>
        </li>
        <li>
          <Link to="/rounds">Rounds</Link>
        </li>
        <li>
          <Link to="/table">Table</Link>
        </li>
        {user ? (
          <li onClick={() => handleLogOut()}>Logout</li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Header;
