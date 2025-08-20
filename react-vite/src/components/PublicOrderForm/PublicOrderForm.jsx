// react-vite/src/components/PublicOrderForm/PublicOrderForm.jsx

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { thunkCreatePublicOrder } from "../../redux/orders";
import "./PublicOrderForm.css";

// This is the PublicOrderForm component
export default function PublicOrderForm() {
  const dispatch = useDispatch();
  const { storeName } = useParams();

  // This will get the list of products from Redux
  const products = useSelector((state) => state.products.list);

  // This will hold the buyer's name and email
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");

  // This will hold the entered product name
  const [productName, setProductName] = useState("");

  // This will handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Find product by name (case-insensitive)
    const product = products.find(
      (p) => p.title.toLowerCase() === productName.toLowerCase()
    );

    // If product not found, show error
    if (!product) {
      alert("Product not found. Please enter a valid product name.");
      return;
    }

    // Build the payload for the thunk
    const payload = {
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      product_names: [product.title],
    };

    // Dispatch the thunk to create a new public order
    const newOrder = await dispatch(thunkCreatePublicOrder(storeName, payload));

    if (newOrder) {
      alert("Order placed successfully!");
      setBuyerName("");
      setBuyerEmail("");
      setProductName("");
    } else {
      alert("Failed to place order.");
    }
  };

  return (
    <div className="public-order-form-page">
      <h2 className="public-order-form-title">Place an Order</h2>

      <form onSubmit={handleSubmit} className="public-order-form">
        <label>
          Buyer Name:
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            required
          />
        </label>

        <label>
          Buyer Email:
          <input
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Product Name:
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
            required
          />
        </label>

        <button type="submit" className="public-order-form-submit">
          Complete Purchase
        </button>
      </form>
    </div>
  );
}
