{/* react-vite/src/components/ProductList/ProductList.jsx */}

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { thunkGetProducts, thunkDeleteProduct } from "../../redux/products";
import "./ProductList.css";

// This is the ProductList component
export default function ProductList() {
  const dispatch = useDispatch();

  // This will get the list of products from Redux
  const products = useSelector((state) => state.products.list);

  // This will fetch products on component mount
  useEffect(() => {
    dispatch(thunkGetProducts());
  }, [dispatch]);

  // This will handle deleting a product
  const handleDelete = (id) => {
    dispatch(thunkDeleteProduct(id));
  };

  return (
    <div className="product-list-page">
      <h2 className="product-list-title">Product List</h2>

      <div className="product-list-actions">
        <Link to="/dashboard/products/new" className="product-list-add">
          + Add Product
        </Link>
      </div>

      {/* This will show empty state if no products exist */}
      {products.length === 0 ? (
        <div className="product-list-empty">
          No products yet.
          <Link to="/dashboard/products/new">
            <button className="product-list-create-button">
              Create your first product
            </button>
          </Link>
        </div>
      ) : (
        <table className="product-list-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Tag</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      width="50"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                {/* This will display the product title */}
                <td>{product.title}</td>
                {/* This will display tags as a comma-separated string */}
                <td>{product.tags?.length ? product.tags.join(", ") : "—"}</td>
                {/* This will display the product price */}
                <td>${product.price}</td>
                {/* This will display stock (if added later) */}
                <td>{product.in_stock ? "Yes" : "No"}</td>
                <td>
                  <Link
                    to={`/dashboard/products/${product.id}/edit`}
                    className="product-list-edit"
                  >
                    Edit
                  </Link>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="product-list-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
