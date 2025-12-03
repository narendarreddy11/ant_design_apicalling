// src/components/NewProductModal.jsx
import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const NewProductModal = ({ show, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      category: '',
      stock: 0,
    },
  });

  useEffect(() => {
    if (!show) {
      reset();
    }
  }, [show, reset]);

  const submitHandler = (data) => {
    data.price = Number(data.price);
    data.stock = Number(data.stock || 0);
    onSubmit(data);
    reset();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className={`form-control ${
                errors.description ? 'is-invalid' : ''
              }`}
              rows={3}
              {...register('description', {
                required: 'Description is required',
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
              className={`form-control ${errors.price ? 'is-invalid' : ''}`}
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be >= 0' },
              })}
            />
            {errors.price && (
              <div className="invalid-feedback">{errors.price.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              className={`form-control ${errors.category ? 'is-invalid' : ''}`}
              {...register('category', {
                required: 'Category is required',
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
              {...register('stock', { valueAsNumber: true })}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Continue
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default NewProductModal;
