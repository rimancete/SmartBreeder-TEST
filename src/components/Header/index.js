import React from 'react';
import { FaHome } from 'react-icons/fa';
// importando links do react-router-dom
import { Link } from 'react-router-dom';

// LOGOUT
// importando componentes redux para logout
import { useSelector } from 'react-redux';

import { Nav } from './styled';

export default function Header() {
  // recebendo estado isLoggedIn
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <Nav>
      {isLoggedIn && (
        <Link to="/">
          <FaHome size={20} />
        </Link>
      )}
    </Nav>
  );
}
