import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import Alert from '../components/Alert';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        mot_de_passe: motDePasse,
      });

      login(response.data.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Échec de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <h2 className="card-title">Connexion</h2>
              <p className="text-muted mb-0">Accédez à votre gestion de stock DanayaBoutique.</p>
            </div>

            {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@entreprise.com"
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
                placeholder="••••••••"
                required
              />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            {/* INSCRIPTION */}
            <div className="text-center mt-3">
              <p>
                Vous n'avez pas de compte ?
              </p>

              <Link
                to="/register"
                className="btn btn-outline-secondary w-100"
              >
                S'inscrire
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;