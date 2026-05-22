import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/api';
import SupplierForm from '../components/SupplierForm';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data.data);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Erreur lors du chargement des fournisseurs.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) =>
      [supplier.nom, supplier.contact, supplier.telephone, supplier.email, supplier.adresse]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search.toLowerCase()))
    );
  }, [suppliers, search]);

  const handleSubmitSupplier = async (supplier) => {
    try {
      if (supplier.id) {
        const response = await api.put(`/suppliers/${supplier.id}`, supplier);
        setSuppliers(suppliers.map((item) => (item.id === supplier.id ? response.data.data : item)));
        setAlert({ type: 'success', message: 'Fournisseur mis à jour.' });
      } else {
        const response = await api.post('/suppliers', supplier);
        setSuppliers([response.data.data, ...suppliers]);
        setAlert({ type: 'success', message: 'Fournisseur ajouté.' });
      }
      setSelectedSupplier(null);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Erreur lors de l’enregistrement.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce fournisseur ?')) return;
    try {
      await api.delete(`/suppliers/${id}`);
      setSuppliers(suppliers.filter((item) => item.id !== id));
      setAlert({ type: 'success', message: 'Fournisseur supprimé.' });
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Impossible de supprimer ce fournisseur.' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3">Gestion des fournisseurs</h1>
          <p className="text-muted mb-0">Créez et mettez à jour vos fournisseurs pour mieux piloter vos achats.</p>
        </div>
        <span className="badge bg-secondary py-2 px-3">Total : {suppliers.length}</span>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="row gy-4">
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Ajouter / modifier un fournisseur</h5>
              <SupplierForm supplier={selectedSupplier} onSubmit={handleSubmitSupplier} />
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
                <div>
                  <h5 className="card-title mb-1">Liste des fournisseurs</h5>
                  <small className="text-muted">{filteredSuppliers.length} résultat{s(filteredSuppliers.length)}</small>
                </div>
                <div className="w-100 w-md-50">
                  <input
                    className="form-control"
                    placeholder="Rechercher un fournisseur"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Contact</th>
                      <th>Téléphone</th>
                      <th>Email</th>
                      <th>Adresse</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.map((supplier) => (
                      <tr key={supplier.id}>
                        <td>{supplier.nom}</td>
                        <td>{supplier.contact || '-'}</td>
                        <td>{supplier.telephone || '-'}</td>
                        <td>{supplier.email || '-'}</td>
                        <td>{supplier.adresse || '-'}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setSelectedSupplier(supplier)}>
                            Modifier
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(supplier.id)}>
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredSuppliers.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          Aucun fournisseur ne correspond à la recherche.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const s = (count) => (count > 1 ? 's' : '');

export default SuppliersPage;
