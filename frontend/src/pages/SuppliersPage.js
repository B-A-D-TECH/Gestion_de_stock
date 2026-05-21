import React, { useEffect, useState } from 'react';
import api from '../api/api';
import SupplierForm from '../components/SupplierForm';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [alert, setAlert] = useState(null);

  const loadSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data.data);
    } catch (error) {
  console.log(error);
  console.log(error.response);
  console.log(error.response?.data);

  setAlert({
    type: 'danger',
    message:
      error.response?.data?.message ||
      'Erreur lors de l’enregistrement.'
  });
}
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

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
    } catch (error) {
      setAlert({ type: 'danger', message: 'Erreur lors de l’enregistrement.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce fournisseur ?')) return;
    try {
      await api.delete(`/suppliers/${id}`);
      setSuppliers(suppliers.filter((item) => item.id !== id));
      setAlert({ type: 'success', message: 'Fournisseur supprimé.' });
    } catch (error) {
      setAlert({ type: 'danger', message: 'Impossible de supprimer ce fournisseur.' });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3">Gestion des fournisseurs</h1>
          <p className="text-muted">Créez et mettez à jour vos fournisseurs pour mieux piloter vos achats.</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

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
              <h5 className="card-title mb-3">Liste des fournisseurs</h5>
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
                    {suppliers.map((supplier) => (
                      <tr key={supplier.id}>
                        <td>{supplier.nom}</td>
                        <td>{supplier.contact}</td>
                        <td>{supplier.telephone}</td>
                        <td>{supplier.email}</td>
                        <td>{supplier.adresse}</td>
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

export default SuppliersPage;
