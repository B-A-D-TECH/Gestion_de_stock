import React, { useEffect, useState } from 'react';

const ProductForm = ({ product, suppliers = [], onSubmit }) => {
  const [reference, setReference] = useState('');
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('0.00');
  const [quantite, setQuantite] = useState(0);
  const [seuil, setSeuil] = useState(5);
  const [fournisseurId, setFournisseurId] = useState('');

  useEffect(() => {
    if (product) {
      setReference(product.reference || '');
      setNom(product.nom || '');
      setDescription(product.description || '');
      setPrix(product.prix || '0.00');
      setQuantite(product.quantite_disponible || 0);
      setSeuil(product.seuil_alerte || 5);
      setFournisseurId(product.fournisseur_id || '');
    }
  }, [product]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      id: product?.id,
      reference,
      nom,
      description,
      prix: Number(prix),
      quantite_disponible: Number(quantite),
      seuil_alerte: Number(seuil),
      fournisseur_id: fournisseurId || null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Référence</label>
        <input value={reference} onChange={(e) => setReference(e.target.value)} className="form-control" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Nom</label>
        <input value={nom} onChange={(e) => setNom(e.target.value)} className="form-control" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" rows="3" />
      </div>
      <div className="row gx-2">
        <div className="col-md-4 mb-3">
          <label className="form-label">Prix</label>
          <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)} className="form-control" step="0.01" min="0" required />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Quantité</label>
          <input type="number" value={quantite} onChange={(e) => setQuantite(e.target.value)} className="form-control" min="0" required />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Seuil d'alerte</label>
          <input type="number" value={seuil} onChange={(e) => setSeuil(e.target.value)} className="form-control" min="0" required />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Fournisseur</label>
        <select value={fournisseurId} onChange={(e) => setFournisseurId(e.target.value)} className="form-select">
          <option value="">Aucun</option>
          {Array.isArray(suppliers) && suppliers.map((f) => (
            <option key={f.id} value={f.id}>{f.nom}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-success w-100">
        {product ? 'Mettre à jour' : 'Ajouter'}
      </button>
    </form>
  );
};

export default ProductForm;
