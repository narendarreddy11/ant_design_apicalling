// src/components/ProductTable.jsx
import React from 'react';

const ProductTable = ({ products, loading }) => {
  if (loading) {
    return <div className="text-center py-3">Loading products...</div>;
  }

  if (!products.length) {
    return <div className="alert alert-info mt-3">No products found.</div>;
  }

  return (
    <div className="table-responsive mt-3">
      <table className="table table-striped table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            <th style={{ width: 60 }}>ID</th>
            <th>Title</th>
            <th style={{ width: 150 }}>Category</th>
            <th style={{ width: 100 }}>Price</th>
            <th style={{ width: 100 }}>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.title}</td>
              <td>{p.category}</td>
              <td>${p.price}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
