import React, { useEffect, useState } from 'react';
import api from '../api/api';
import AlertsCard from '../components/AlertsCard';
import StatsCard from '../components/StatsCard';

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setDashboard(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3">Tableau de bord</h1>
          <p className="text-muted">Vue synthétique de votre stock et des alertes.</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <StatsCard title="Produits totals" value={dashboard.totalProducts} variant="primary" />
        <StatsCard title="Produits en rupture" value={dashboard.outOfStock} variant="danger" />
        <StatsCard title="Stock faible" value={dashboard.lowStock} variant="warning" />
        <StatsCard title="Quantité totale" value={dashboard.totalQuantity} variant="success" />
      </div>

      <div className="row g-3 mb-4">
        <AlertsCard
          title="Alertes de stock"
          message={dashboard.lowStock > 0 ? `Il y a ${dashboard.lowStock} produit(s) en dessous du seuil critique.` : 'Aucune alerte de stock faible.'}
          variant={dashboard.lowStock > 0 ? 'warning' : 'success'}
        />
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Mouvements récents</h5>
          {dashboard.recentMovements.length === 0 ? (
            <p>Aucun mouvement enregistré.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Type</th>
                    <th>Quantité</th>
                    <th>Après</th>
                    <th>Utilisateur</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentMovements.map((item) => (
                    <tr key={item.id}>
                      <td>{item.produit_nom}</td>
                      <td>{item.type_mouvement}</td>
                      <td>{item.quantite}</td>
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

export default DashboardPage;
