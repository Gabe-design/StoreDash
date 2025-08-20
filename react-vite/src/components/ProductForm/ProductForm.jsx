// react-vite/src/components/PublicForm/ProductForm.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { thunkAddProduct, thunkUpdateProduct, thunkGetProducts } from "../../redux/products";
import "./ProductForm.css";

// This is the form component used for creating and updating products
function ProductForm() {
  // This will give us access to dispatch actions
  const dispatch = useDispatch();
  // This will allow navigation after form submission
  const navigate = useNavigate();
  // This will grab the productId from the route (if it exists)
  const { productId } = useParams();

  // This will get the current list of products from Redux
  const products = useSelector((state) => state.products.list);

  // This will find the product to edit (if productId is present)
  const productToEdit = productId
    ? products.find((product) => product.id === parseInt(productId))
    : null;

  // This will store form input values
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    image_url: "",
    tags: "",
    in_stock: true,
  });

  // This will store any validation or server errors
  const [errors, setErrors] = useState({});

  // This will load products if editing and data isn’t available yet
  useEffect(() => {
    if (productId && !productToEdit) {
      dispatch(thunkGetProducts());
    }
  }, [dispatch, productId, productToEdit]);

  // This will prefill the form if we are editing a product
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title || "",
        price: productToEdit.price || "",
        description: productToEdit.description || "",
        image_url: productToEdit.image_url || "",
        tags: productToEdit.tags?.join(", ") || "",
        in_stock: productToEdit.in_stock ?? true,
      });
    }
  }, [productToEdit]);

  // This will handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // This will handle form submission for create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    let serverErrors;
    if (productId) {
      // This will update an existing product
      serverErrors = await dispatch(thunkUpdateProduct(productId, formData));
    } else {
      // This will create a new product
      serverErrors = await dispatch(thunkAddProduct(formData));
    }

    // If there are server errors, set them in state
    if (serverErrors) {
      setErrors(serverErrors);
    } else {
      // If successful, go back to the product list
      navigate("/dashboard/products");
    }
  };

  return (
    <div className="dashboard-layout">
      <main className="dashboard-main">
        <h2 className="product-form-title">
          {productId ? "Update Product" : "Create Product"}
        </h2>

        {/* This will display any errors */}
        {Object.values(errors).length > 0 && (
          <div className="product-form-error-list">
            {Object.values(errors).map((err, idx) => (
              <p key={idx} className="product-form-error">
                {err}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          {/* Product title */}
          <label className="product-form-label">
            Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="product-form-input"
              placeholder="Product title"
              required
            />
          </label>
          {errors.title && (
            <p className="product-form-error">{errors.title}</p>
          )}

          {/* Product price */}
          <label className="product-form-label">
            Price
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="product-form-input"
              placeholder="Product price"
              required
            />
          </label>
          {errors.price && (
            <p className="product-form-error">{errors.price}</p>
          )}

          {/* Product description */}
          <label className="product-form-label">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="product-form-textarea"
              placeholder="Product description"
            />
          </label>
          {errors.description && (
            <p className="product-form-error">{errors.description}</p>
          )}

          {/* Product image URL */}
          <label className="product-form-label">
            Image URL
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="product-form-input"
              placeholder="Image URL"
            />
          </label>
          {errors.image_url && (
            <p className="product-form-error">{errors.image_url}</p>
          )}

          {/* Product tags */}
          <label className="product-form-label">
            Tags (comma separated)
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="product-form-input"
              placeholder="e.g. summer, shirt"
            />
          </label>
          {errors.tags && <p className="product-form-error">{errors.tags}</p>}

          {/* Save button */}
          <button type="submit" className="product-form-button">
            {productId ? "Update Product" : "Create Product"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default ProductForm;
