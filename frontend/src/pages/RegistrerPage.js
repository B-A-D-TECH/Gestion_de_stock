import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

const RegisterPage = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [role, setRole] = useState('user');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await api.post('/auth/register', {
        nom,
        email,
        mot_de_passe: motDePasse,
      });

      setSuccess("Compte créé avec succès !");
      
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">

          <div className="card shadow-sm">
            <div className="card-body">

              <h2 className="text-center mb-4">
                Inscription
              </h2>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
  <label className="form-label">Rôle</label>

  <select
    className="form-control"
    value={role}
    onChange={(e) => setRole(e.target.value)}
  >
    <option value="user">Utilisateur</option>
    <option value="admin">Administrateur</option>
  </select>
</div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                >
                  S'inscrire
                </button>

              </form>

              <div className="text-center mt-3">
                <Link to="/">
                  Déjà un compte ? Se connecter
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;