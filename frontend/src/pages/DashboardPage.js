import React, { useEffect, useState } from 'react';
import api from '../api/api';
import AlertsCard from '../components/AlertsCard';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setDashboard(response.data.data);
      } catch (err) {
        setError(err.message || 'Impossible de charger le tableau de bord.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalMovements = (dashboard.totalEntries || 0) + (dashboard.totalExits || 0);
  const entriesPercent = totalMovements ? Math.round((dashboard.totalEntries / totalMovements) * 100) : 0;
  const exitsPercent = totalMovements ? 100 - entriesPercent : 0;

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3">Tableau de bord</h1>
          <p className="text-muted mb-0">Vue synthétique de votre stock et des alertes clés.</p>
        </div>
        <span className="badge bg-info text-dark py-2 px-3">Mouvements totaux : {totalMovements}</span>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}

      <div className="row g-3 mb-4">
        <StatsCard title="Produits totals" value={dashboard.totalProducts} variant="primary" />
        <StatsCard title="Produits en rupture" value={dashboard.outOfStock} variant="danger" />
        <StatsCard title="Stock faible" value={dashboard.lowStock} variant="warning" />
        <StatsCard title="Quantité totale" value={dashboard.totalQuantity} variant="success" />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Analyse des mouvements</h5>
              <p className="text-muted">Entrées et sorties de stock, en temps réel.</p>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Entrées</span>
                  <strong>{dashboard.totalEntries || 0}</strong>
                </div>
                <div className="progress" style={{ height: '12px' }}>
                  <div className="progress-bar bg-success" role="progressbar" style={{ width: `${entriesPercent}%` }} aria-valuenow={entriesPercent} aria-valuemin="0" aria-valuemax="100" />
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Sorties</span>
                  <strong>{dashboard.totalExits || 0}</strong>
                </div>
                <div className="progress" style={{ height: '12px' }}>
                  <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${exitsPercent}%` }} aria-valuenow={exitsPercent} aria-valuemin="0" aria-valuemax="100" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <AlertsCard
            title="Alertes de stock"
            message={dashboard.lowStock > 0 ? `Il y a ${dashboard.lowStock} produit(s) en dessous du seuil critique.` : 'Aucune alerte de stock faible.'}
            variant={dashboard.lowStock > 0 ? 'warning' : 'success'}
          />
        </div>
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
