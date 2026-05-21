import React, { useState } from 'react';

const StockMovementForm = ({ products, onSubmit }) => {
  const [produitId, setProduitId] = useState('');
  const [type, setType] = useState('ENTREE');
  const [quantite, setQuantite] = useState(1);
  const [note, setNote] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ produit_id: produitId, type_mouvement: type, quantite, note });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Produit</label>
        <select className="form-select" value={produitId} onChange={(e) => setProduitId(e.target.value)} required>
          <option value="">Sélectionner un produit</option>
          {products.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nom} ({item.quantite_disponible})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Type</label>
        <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="ENTREE">Entrée</option>
          <option value="SORTIE">Sortie</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Quantité</label>
        <input type="number" className="form-control" value={quantite} onChange={(e) => setQuantite(Number(e.target.value))} min="1" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Note</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} className="form-control" />
      </div>
      <button type="submit" className="btn btn-primary w-100">
        Ajouter le mouvement
      </button>
    </form>
  );
};

export default StockMovementForm;
