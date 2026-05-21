import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import SuppliersPage from './pages/SuppliersPage';
import StockHistoryPage from './pages/StockHistoryPage';
import Navbar from './components/Navbar';
import { AuthContext } from './contexts/AuthContext';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {user && <Navbar />}
      <div className="container py-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/produits" element={user ? <ProductsPage /> : <Navigate to="/login" />} />
          <Route path="/fournisseurs" element={user ? <SuppliersPage /> : <Navigate to="/login" />} />
          <Route path="/historique" element={user ? <StockHistoryPage /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
