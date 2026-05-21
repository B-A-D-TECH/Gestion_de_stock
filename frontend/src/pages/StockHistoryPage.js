import React, { useEffect, useState } from 'react';
import api from '../api/api';

const StockHistoryPage = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const response = await api.get('/stock/movements');
        setMovements(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovements();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3">Historique des mouvements de stock</h1>
          <p className="text-muted">Suivez toutes les entrées et sorties de stock de manière détaillée.</p>
        </div>
      </div>

      {loading ? (
        <div>Chargement...</div>
      ) : (
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
      )}
    </>
  );
};

export default StockHistoryPage;
