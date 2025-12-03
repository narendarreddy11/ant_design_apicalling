// src/pages/ConfirmProductPage.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createProduct } from "../api/product";

const ConfirmProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const productData = location.state;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (productData) {
      reset({
        title: productData.title,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
      });
    }
  }, [productData, reset]);

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      alert(`Product created with ID: ${data.id}`);

      // 👉 Send the created product back to the list page
      navigate("/products", {
        state: { newProduct: data },
      });
    },
    onError: (err) => {
      alert(err.message || "Failed to create product");
    },
  });

  if (!productData) {
    return (
      <div className="card shadow-sm">
        <div className="card-body">
          <p>No product data found. Please go back and add a product.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/products")}
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = (values) => {
    const payload = {
      ...values,
      price: Number(values.price),
      stock: Number(values.stock || 0),
      createdFromStartDate: productData.startDate,
      createdFromEndDate: productData.endDate,
    };
    mutation.mutate(payload);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">Confirm New Product (Page 2)</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <h6>Date Range Used:</h6>
          <p className="mb-1">
            <strong>Start Date:</strong> {productData.startDate}
          </p>
          <p className="mb-1">
            <strong>End Date:</strong> {productData.endDate}
          </p>
        </div>

        <p>Please confirm or update the product details before creating:</p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 600 }}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
              rows={3}
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <div className="invalid-feedback">
                {errors.description.message}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Price</label>
            <input
              type="number"
              className={`form-control ${errors.price ? "is-invalid" : ""}`}
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be >= 0" },
              })}
            />
            {errors.price && (
              <div className="invalid-feedback">{errors.price.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              className={`form-control ${errors.category ? "is-invalid" : ""}`}
              {...register("category", {
                required: "Category is required",
              })}
            />
            {errors.category && (
              <div className="invalid-feedback">{errors.category.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Stock</label>
            <input
              type="number"
              className="form-control"
              {...register("stock", { valueAsNumber: true })}
            />
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/products")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Confirm & Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmProductPage;
