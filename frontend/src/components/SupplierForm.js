import React, { useEffect, useState } from 'react';

const SupplierForm = ({ supplier, onSubmit }) => {
  const [nom, setNom] = useState('');
  const [contact, setContact] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [adresse, setAdresse] = useState('');

  useEffect(() => {
    if (supplier) {
      setNom(supplier.nom || '');
      setContact(supplier.contact || '');
      setTelephone(supplier.telephone || '');
      setEmail(supplier.email || '');
      setAdresse(supplier.adresse || '');
    }
  }, [supplier]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      id: supplier?.id,
      nom,
      contact,
      telephone,
      email,
      adresse,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Nom</label>
        <input value={nom} onChange={(e) => setNom(e.target.value)} className="form-control" required />
      </div>
      <div className="mb-3">
        <label className="form-label">Contact</label>
        <input value={contact} onChange={(e) => setContact(e.target.value)} className="form-control" />
      </div>
      <div className="mb-3">
        <label className="form-label">Téléphone</label>
        <input value={telephone} onChange={(e) => setTelephone(e.target.value)} className="form-control" />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
      </div>
      <div className="mb-3">
        <label className="form-label">Adresse</label>
        <input value={adresse} onChange={(e) => setAdresse(e.target.value)} className="form-control" />
      </div>
      <button type="submit" className="btn btn-success w-100">
        {supplier ? 'Mettre à jour' : 'Ajouter'}
      </button>
    </form>
  );
};

export default SupplierForm;
