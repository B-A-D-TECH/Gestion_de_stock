import React, { useEffect, useState } from 'react';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const StockHistoryPage = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const response = await api.get('/stock/movements');
        setMovements(response.data.data);
      } catch (err) {
        setError(err.message || 'Impossible de charger l\'historique.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovements();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3">Historique des mouvements de stock</h1>
          <p className="text-muted mb-0">Suivez toutes les entrées et sorties de stock de manière détaillée.</p>
        </div>
        <span className="badge bg-secondary py-2 px-3">Total : {movements.length}</span>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

      <div className="card shadow-sm">
        <div className="card-body">
          {movements.length === 0 ? (
            <p>Aucun mouvement enregistré pour l’instant.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Type</th>
                    <th>Quantité</th>
                    <th>Avant</th>
                    <th>Après</th>
                    <th>Utilisateur</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((item) => (
                    <tr key={item.id}>
                      <td>{item.produit_nom}</td>
                      <td>{item.type_mouvement}</td>
                      <td>{item.quantite}</td>
                      <td>{item.quantite_avant}</td>
                      <td>{item.quantite_apres}</td>
                      <td>{item.utilisateur_nom}</td>
                      <td>{new Date(item.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StockHistoryPage;
