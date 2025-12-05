// src/pages/ProductListPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchProducts } from '../api/product';
import DateRangeFilter from '../components/DateRangeFilter';
import ProductTable from '../components/ProductTable';
import NewProductModal from '../components/NewProductModal';

const ADDED_PRODUCTS_KEY = 'addedProducts';

const ProductListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 new product coming from ConfirmProductPage (only latest one)
  const newProduct = location.state?.newProduct || null;

  // 👇 keep ALL added products here, initialized from localStorage
  const [addedProducts, setAddedProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(ADDED_PRODUCTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState(dayjs());
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', searchTerm],
    queryFn: fetchProducts,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const value = new FormData(e.target).get('search') || '';
    setSearchTerm(value);
  };

  const handleNewProductSubmit = (values) => {
    const payload = {
      ...values,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
    };
    setShowModal(false);
    navigate('/confirm-product', { state: payload });
  };

  const filteredProducts = (products || []).filter((p) => {
    if (priceFilter === 'lt50') return p.price < 50;
    if (priceFilter === '50to100') return p.price >= 50 && p.price <= 100;
    if (priceFilter === 'gt100') return p.price > 100;
    return true;
  });

  // 🔁 When a newProduct arrives from Confirm page, store it in local state AND localStorage
  useEffect(() => {
    if (newProduct) {
      setAddedProducts((prev) => {
        const exists = prev.some((p) => p.id === newProduct.id);
        if (exists) return prev;
        return [newProduct, ...prev];
      });

      // Clear location.state so it won't re-add on refresh/back
      navigate('/products', { replace: true, state: {} });
    }
  }, [newProduct, navigate]);

  // 🧷 Sync addedProducts to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(ADDED_PRODUCTS_KEY, JSON.stringify(addedProducts));
    } catch {
      // ignore storage errors
    }
  }, [addedProducts]);

  // ✅ Final products for table:
  //    - all locally added products first
  //    - then filtered products from API
  const tableProducts = useMemo(() => {
    // dummyjson won't contain our generated ids, so no need to filter them out,
    // but we could if we want to be extra safe.
    return [...addedProducts, ...filteredProducts];
  }, [addedProducts, filteredProducts]);

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Product List (Page 1)</h5>
      </div>
      <div className="card-body">
        {/* Top filters */}
        <div className="row g-3 align-items-end mb-3">
          <div className="col-lg-6 col-md-12">
            <label className="form-label fw-semibold">Date Range</label>
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartChange={setStartDate}
              onEndChange={setEndDate}
            />
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="d-flex flex-wrap gap-2 justify-content-end">
              <form
                className="d-flex gap-2"
                onSubmit={handleSearch}
                style={{ minWidth: 0 }}
              >
                <input
                  name="search"
                  type="text"
                  className="form-control"
                  placeholder="Search products"
                  defaultValue={searchTerm}
                />
                <button type="submit" className="btn btn-outline-primary">
                  Search
                </button>
              </form>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="form-select"
                style={{ maxWidth: 200 }}
              >
                <option value="all">All prices</option>
                <option value="lt50">Price &lt; 50</option>
                <option value="50to100">50 ≤ Price ≤ 100</option>
                <option value="gt100">Price &gt; 100</option>
              </select>

              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                Add New Product
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error.message || 'Error fetching products'}
          </div>
        )}

        <ProductTable products={tableProducts} loading={isLoading} />

        <NewProductModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleNewProductSubmit}
        />
      </div>
    </div>
  );
};

export default ProductListPage;
