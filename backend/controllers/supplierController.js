const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../models/supplierModel');

const listSuppliers = async (req, res, next) => {
  try {
    const suppliers = await getAllSuppliers();
    res.json({ success: true, data: suppliers });
  } catch (error) {
    next(error);
  }
};

const getSupplier = async (req, res, next) => {
  try {
    const supplier = await getSupplierById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Fournisseur non trouvé.' });
    }
    res.json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

const createNewSupplier = async (req, res, next) => {
  try {
    const supplier = await createSupplier(req.body);
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

const updateExistingSupplier = async (req, res, next) => {
  try {
    const supplier = await getSupplierById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Fournisseur non trouvé.' });
    }

    const updatedSupplier = await updateSupplier(req.params.id, req.body);
    res.json({ success: true, data: updatedSupplier });
  } catch (error) {
    next(error);
  }
};

const removeSupplier = async (req, res, next) => {
  try {
    const supplier = await getSupplierById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Fournisseur non trouvé.' });
    }

    await deleteSupplier(req.params.id);
    res.json({ success: true, message: 'Fournisseur supprimé.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listSuppliers,
  getSupplier,
  createNewSupplier,
  updateExistingSupplier,
  removeSupplier,
};
