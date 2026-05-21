import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          Gestion de Stock
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/produits">Produits</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fournisseurs">Fournisseurs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/historique">Historique</Link>
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
