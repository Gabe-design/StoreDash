// src/components/PublicStore/PublicStore.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./PublicStore.css";

function PublicStore() {
  // This will get the store name from the URL
  const { storeName } = useParams();

  // This will store the store and product data from the API
  const [storeData, setStoreData] = useState(null);

  // This will store any error state
  const [error, setError] = useState(null);

  // This will store the search query for filtering products
  const [searchQuery, setSearchQuery] = useState("");

  // This will store the order form data
  const [orderForm, setOrderForm] = useState({
    buyer_name: "",
    buyer_email: "",
    products: "",
  });

  // This will disable the purchase button until form is valid
  const isOrderValid =
    orderForm.buyer_name.trim().length > 0 &&
    orderForm.buyer_email.trim().length > 0 &&
    orderForm.products.trim().length > 0;

  // Fetch the public store data when the component mounts
  useEffect(() => {
    fetch(`/api/public/stores/${storeName}`)
      .then((res) => {
        if (res.status === 404) {
          setError("not-found");
          return null;
        }
        if (!res.ok) {
          setError("server-error");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setStoreData(data);
        }
      })
      .catch(() => {
        setError("network-error");
      });
  }, [storeName]);

  // Handle form input changes for the order form
  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderForm({ ...orderForm, [name]: value });
  };

  // Handle order form submission
  const handleOrderSubmit = (e) => {
    e.preventDefault();

    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderForm),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Order placed successfully!");
        setOrderForm({ buyer_name: "", buyer_email: "", products: "" });
      })
      .catch(() => alert("Failed to place order."));
  };

  // Show store not found message
  if (error === "not-found") {
    return (
      <div className="public-store-error">
        <h2>Store not found</h2>
        <p>
          It looks like this store hasn’t been set up yet.{" "}
          <Link to="/dashboard/store">Customize your store</Link> to get started.
        </p>
      </div>
    );
  }

  // Show error for network/server issues
  if (error === "server-error" || error === "network-error") {
    return (
      <div className="public-store-error">
        <h2>Something went wrong</h2>
        <p>Please try again later.</p>
      </div>
    );
  }

  // Show loading while fetching data
  if (!storeData) {
    return <p>Loading store...</p>;
  }

  // Filter products by search query
  const filteredProducts = storeData.products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="public-store-page">
      {/* Store header */}
      <div className="public-store-header">
        {storeData.store.logo_url && (
          <img
            src={storeData.store.logo_url}
            alt={`${storeData.store.name} logo`}
            className="public-store-logo"
          />
        )}
        <h1>{storeData.store.name}</h1>
        <p>{storeData.store.description}</p>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="public-store-search"
        />
      </div>

      {/* Products grid */}
      <div className="public-store-products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="public-store-product">
              <img src={product.image_url} alt={product.title} />
              <h3>{product.title}</h3>
              <span className="public-store-tag">{product.tags.join(", ")}</span>
              <p>Unit Cost: ${product.price}</p>
              {product.in_stock ? (
                <span className="public-store-stock in-stock">✔ In stock</span>
              ) : (
                <span className="public-store-stock out-of-stock">✘ Out of stock</span>
              )}
            </div>
          ))
        ) : (
          <p>No products match your search.</p>
        )}
      </div>

      {/* Order form */}
      <form onSubmit={handleOrderSubmit} className="public-store-order-form">
        <input
          type="text"
          name="buyer_name"
          placeholder="Enter name"
          value={orderForm.buyer_name}
          onChange={handleOrderChange}
        />
        <input
          type="email"
          name="buyer_email"
          placeholder="Enter email address"
          value={orderForm.buyer_email}
          onChange={handleOrderChange}
        />
        <input
          type="text"
          name="products"
          placeholder="Enter products you wish to buy"
          value={orderForm.products}
          onChange={handleOrderChange}
        />
        <button type="submit" disabled={!isOrderValid}>
          Complete Purchase
        </button>
      </form>
    </div>
  );
}

export default PublicStore;
