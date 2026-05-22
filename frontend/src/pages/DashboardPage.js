import React, { useEffect, useState } from 'react';
import api from '../api/api';
import AlertsCard from '../components/AlertsCard';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyName, setCompanyName] = useState(localStorage.getItem('companyName') || '');
  const [companySaved, setCompanySaved] = useState(false);

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

  const movementLabels = dashboard.movementHistory?.map((item) => item.date) || [];
  const movementEntries = dashboard.movementHistory?.map((item) => item.entries) || [];
  const movementExits = dashboard.movementHistory?.map((item) => item.exits) || [];

  const lineData = {
    labels: movementLabels,
    datasets: [
      {
        label: 'Entrées',
        data: movementEntries,
        borderColor: '#198754',
        backgroundColor: 'rgba(25, 135, 84, 0.2)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Sorties',
        data: movementExits,
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: ['Entrées', 'Sorties'],
    datasets: [
      {
        data: [dashboard.totalEntries || 0, dashboard.totalExits || 0],
        backgroundColor: ['#198754', '#dc3545'],
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3">Tableau de bord</h1>
          <p className="text-muted mb-0">Vue synthétique de votre stock et des alertes clés.</p>
        </div>
          <div className="d-flex align-items-center gap-2">
            <input
              type="text"
              className="form-control form-control-sm w-auto"
              placeholder="Nom de l'entreprise"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <button className="btn btn-sm btn-primary" onClick={() => {
              localStorage.setItem('companyName', companyName);
              setCompanySaved(true);
              setTimeout(() => setCompanySaved(false), 2500);
            }}>
              Enregistrer
            </button>
            {companySaved && <span className="badge bg-success">Nom enregistré</span>}
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

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
            <div>
              <h5 className="card-title mb-1">Analytics du stock</h5>
              <p className="text-muted mb-0">Indicateurs clés pour suivre la performance de votre inventaire.</p>
            </div>
            <span className="badge bg-primary bg-opacity-10 text-primary py-2 px-3">Dashboard</span>
          </div>
          <div className="row g-3">
            <StatsCard
              title="Rotation de stock"
              value={dashboard.turnoverRate ? `${dashboard.turnoverRate}%` : 'N/A'}
              variant="info"
            />
            <StatsCard
              title="Valeur du stock"
              value={dashboard.totalStockValue ? `${dashboard.totalStockValue} €` : 'N/A'}
              variant="success"
            />
            <StatsCard
              title="Meilleur produit"
              value={dashboard.topProduct || 'Aucune donnée'}
              variant="secondary"
            />
            <StatsCard
              title="Stock critique"
              value={dashboard.lowStock || 0}
              variant="danger"
            />
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Évolution des mouvements</h5>
              <p className="text-muted">Graphique des entrées et sorties sur 7 jours.</p>
              <div className="chart-wrapper" style={{ minHeight: '320px' }}>
                {movementLabels.length === 0 ? (
                  <p className="text-muted">Pas encore de données sur les 7 derniers jours.</p>
                ) : (
                  <Line data={lineData} options={chartOptions} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title">Répartition des mouvements</h5>
                <p className="text-muted">Proportion des entrées et sorties de stock.</p>
                <div style={{ minHeight: '260px' }}>
                  <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                </div>
              </div>
              <div className="mt-4">
                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>Entrées totales</span>
                  <strong>{dashboard.totalEntries || 0}</strong>
                </div>
                <div className="d-flex justify-content-between text-muted mb-2">
                  <span>Sorties totales</span>
                  <strong>{dashboard.totalExits || 0}</strong>
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <span>Progression</span>
                  <strong>{entriesPercent}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
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
