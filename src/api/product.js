// src/api/product.js
const BASE_URL = 'https://dummyjson.com';

export const fetchProducts = async ({ queryKey }) => {
  const [, searchTerm] = queryKey;
  let url = `${BASE_URL}/products`;
  if (searchTerm?.trim()) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(searchTerm.trim())}`;
  }
  const res = await fetch(url);
  const data = await res.json();
  return data.products || [];
};

export const createProduct = async (product) => {
  const res = await fetch(`${BASE_URL}/products/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return res.json();
};
