import React, { useState } from 'react';
// 1. Importer useNavigate depuis react-router-dom
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  // 2. Initialiser le hook de navigation
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    mot_de_passe: '',
    role: 'Utilisateur'
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.nom || !formData.email || !formData.mot_de_passe) {
      setMessage({ type: 'danger', text: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }

    try {
      // 3. Appel réel à ton API Express/Node.js
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Si le backend renvoie une erreur (ex: email déjà utilisé)
        throw new Error(data.message || "Une erreur est survenue lors de l'inscription.");
      }
      
      // Si l'inscription réussit en BDD :
      setMessage({ type: 'success', text: 'Inscription réussie ! Redirection en cours...' });
      
      // Optionnel : Si ton API renvoie un token ou connecte l'utilisateur directement, 
      // tu peux le stocker ici (ex: localStorage.setItem('token', data.token))

      // 4. Redirection vers la page d'accueil (ex: '/dashboard' ou '/') après un court instant
      setTimeout(() => {
        navigate('/dashboard'); // Ajuste la route selon ton fichier App.jsx (ex: '/' ou '/dashboard')
      }, 1500); // 1.5 seconde d'attente pour laisser le temps de lire le message de succès

    } catch (error) {
      setMessage({ type: 'danger', text: error.message });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 className="text-center mb-4 text-primary">Créer un compte</h2>
        <p className="text-muted text-center small mb-4">Application de Gestion de Stock</p>

        {message.text && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nom complet</label>
            <input
              type="text"
              className="form-control"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex: Ahmed Alami"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Adresse Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nom@pme.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              name="mot_de_passe"
              value={formData.mot_de_passe}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Rôle</label>
            <select
              className="form-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Utilisateur">Utilisateur</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;