// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import ProductListPage from './pages/ProductListPage';
import ConfirmProductPage from './pages/ConfirmProductPage';

const App = () => {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <nav className="navbar navbar-dark bg-dark mb-3">
        <div className="container">
          <Link className="navbar-brand" to="/products">
            React Assignment – Products
          </Link>
        </div>
      </nav>

      <main className="container flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="/products" />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/confirm-product" element={<ConfirmProductPage />} />
        </Routes>
      </main>

      <footer className="bg-dark text-white text-center py-2 mt-3">
        <small>Demo app with React Query, Bootstrap & React Hook Form</small>
      </footer>
    </div>
  );
};

export default App;
