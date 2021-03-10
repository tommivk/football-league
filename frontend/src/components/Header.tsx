import React from 'react';
import { Link } from 'react-router-dom';


const Header = () => {
    return(
        <div className="header">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/fixtures">Fixtures</Link></li>
                <li><Link to="/rounds">Rounds</Link></li>
                <li><Link to="/table">Table</Link></li>
                <li><Link to="/login">Login</Link></li>
            </ul>
        </div>
    )
};

export default Header;