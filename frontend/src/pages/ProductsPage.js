import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/api';
import ProductForm from '../components/ProductForm';
import StockMovementForm from '../components/StockMovementForm';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([api.get('/products'), api.get('/suppliers')]);
      setProducts(pRes.data.data);
      setSuppliers(sRes.data.data);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Impossible de charger les données.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = [product.nom, product.reference, product.description, product.fournisseur_nom]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search.toLowerCase()));
      const matchesSupplier = supplierFilter ? product.fournisseur_id === Number(supplierFilter) : true;
      const quantity = product.quantite_disponible || 0;
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'low' && quantity > 0 && quantity <= product.seuil_alerte) ||
        (stockFilter === 'out' && quantity <= 0);

      return matchesSearch && matchesSupplier && matchesStock;
    });
  }, [products, search, supplierFilter, stockFilter]);

  const summary = useMemo(() => ({
    total: products.length,
    lowStock: products.filter((product) => product.quantite_disponible > 0 && product.quantite_disponible <= product.seuil_alerte).length,
    outOfStock: products.filter((product) => product.quantite_disponible <= 0).length,
  }), [products]);

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression du produit ?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
      setAlert({ type: 'success', message: 'Produit supprimé.' });
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Erreur lors de la suppression.' });
    }
  };

  const handleSubmitProduct = async (product) => {
    try {
      if (product.id) {
        const response = await api.put(`/products/${product.id}`, product);
        setProducts(products.map((p) => (p.id === product.id ? response.data.data : p)));
        setAlert({ type: 'success', message: 'Produit mis à jour.' });
      } else {
        const response = await api.post('/products', product);
        setProducts([response.data.data, ...products]);
        setAlert({ type: 'success', message: 'Produit ajouté.' });
      }
      setSelectedProduct(null);
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Erreur lors de l’enregistrement.' });
    }
  };

  const handleCreateMovement = async (movement) => {
    try {
      await api.post('/stock', movement);
      setAlert({ type: 'success', message: 'Mouvement enregistré.' });
      loadAll();
    } catch (err) {
      setAlert({ type: 'danger', message: err.message || 'Erreur lors du mouvement.' });
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3">Gestion des produits</h1>
          <p className="text-muted mb-0">Ajoutez, modifiez ou supprimez vos produits et gérez les mouvements de stock.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <span className="badge bg-primary py-2 px-3">Total : {summary.total}</span>
          <span className="badge bg-warning text-dark py-2 px-3">Stock faible : {summary.lowStock}</span>
          <span className="badge bg-danger py-2 px-3">Rupture : {summary.outOfStock}</span>
        </div>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="row gy-4 mb-4">
        <div className="col-xl-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Ajouter / modifier un produit</h5>
              <ProductForm product={selectedProduct} suppliers={suppliers} onSubmit={handleSubmitProduct} />
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Mouvement de stock</h5>
              <StockMovementForm products={products} onSubmit={handleCreateMovement} />
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Filtrer les produits</h5>
              <div className="mb-3">
                <label className="form-label">Recherche</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nom, référence, fournisseur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fournisseur</label>
                <select className="form-select" value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}>
                  <option value="">Tous</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>{supplier.nom}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">État du stock</label>
                <select className="form-select" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
                  <option value="all">Tous</option>
                  <option value="low">Stock faible</option>
                  <option value="out">Rupture</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
            <div>
              <h5 className="card-title mb-1">Liste des produits</h5>
              <small className="text-muted">{filteredProducts.length} résultat{s(filteredProducts.length)}</small>
            </div>
            <div className="text-muted">Dernière mise à jour automatique</div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Réf</th>
                  <th>Nom</th>
                  <th>Stock</th>
                  <th>Seuil</th>
                  <th>Fournisseur</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.reference}</td>
                    <td>{product.nom}</td>
                    <td>
                      <span className={`badge ${product.quantite_disponible <= 0 ? 'bg-danger' : product.quantite_disponible <= product.seuil_alerte ? 'bg-warning text-dark' : 'bg-success'}`}>
                        {product.quantite_disponible}
                      </span>
                    </td>
                    <td>{product.seuil_alerte}</td>
                    <td>{product.fournisseur_nom || '-'}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setSelectedProduct(product)}>
                        Modifier
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.id)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      Aucun produit ne correspond aux filtres.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

const s = (count) => (count > 1 ? 's' : '');

export default ProductsPage;
