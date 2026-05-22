import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('D.B');

  useEffect(() => {
    const name = localStorage.getItem('companyName');
    if (name) setCompanyName(name);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/dashboard">
          {companyName || 'D.B'}
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className={({isActive}) => (isActive ? 'nav-link active' : 'nav-link')} to="/dashboard">Dashboard</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => (isActive ? 'nav-link active' : 'nav-link')} to="/produits">Produits</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => (isActive ? 'nav-link active' : 'nav-link')} to="/fournisseurs">Fournisseurs</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => (isActive ? 'nav-link active' : 'nav-link')} to="/historique">Historique</NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center text-white">
            <span className="me-3">{user?.nom} ({user?.role})</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Déconnexion</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
