import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ProductForm from '../components/ProductForm';
import StockMovementForm from '../components/StockMovementForm';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [alert, setAlert] = useState(null);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      setAlert({ type: 'danger', message: 'Impossible de charger les produits.' });
    }
  };

  const loadSuppliers = async () => {
    try {
      const response = await api.get('/suppliers');
      setSuppliers(response.data.data);
    } catch (error) {
      console.error('Impossible de charger les fournisseurs.', error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression du produit ?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
      setAlert({ type: 'success', message: 'Produit supprimé.' });
    } catch (error) {
      setAlert({ type: 'danger', message: 'Erreur lors de la suppression.' });
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
    } catch (error) {
      setAlert({ type: 'danger', message: 'Erreur lors de l’enregistrement.' });
    }
  };

  const handleCreateMovement = async (movement) => {
    try {
      await api.post('/stock', movement);
      setAlert({ type: 'success', message: 'Mouvement enregistré.' });
      loadProducts();
    } catch (error) {
      setAlert({ type: 'danger', message: error.response?.data?.message || 'Erreur lors du mouvement.' });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3">Gestion des produits</h1>
          <p className="text-muted">Ajoutez, modifiez ou supprimez vos produits et gérez les mouvements de stock.</p>
        </div>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}

      <div className="row gy-4">
        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Ajouter / modifier un produit</h5>
              <ProductForm product={selectedProduct} suppliers={suppliers} onSubmit={handleSubmitProduct} />
            </div>
          </div>
          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h5 className="card-title">Mouvement de stock</h5>
              <StockMovementForm products={products} onSubmit={handleCreateMovement} />
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Liste des produits</h5>
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
                    {products.map((product) => (
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

export default ProductsPage;
