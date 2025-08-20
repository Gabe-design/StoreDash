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
    product_names: "",
  });

  // This will disable the purchase button until form is valid
  const isOrderValid =
    orderForm.buyer_name.trim().length > 0 &&
    orderForm.buyer_email.trim().length > 0 &&
    orderForm.product_names.trim().length > 0;

  // This will fetch the public store data when the component mounts
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

  // This will handle changes in the order form
  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderForm({ ...orderForm, [name]: value });
  };

  // This will handle submitting the order form
  const handleOrderSubmit = (e) => {
    e.preventDefault();

    // This will transform product_names (comma-separated string) into a list of strings
    const payload = {
      buyer_name: orderForm.buyer_name,
      buyer_email: orderForm.buyer_email,
      product_names: orderForm.product_names
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name.length > 0),
    };

    fetch(`/api/public/stores/${storeName}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // This sends product_names as a list of strings
    })
      .then((res) => res.json())
      .then(() => {
        alert("Order placed successfully!");
        setOrderForm({ buyer_name: "", buyer_email: "", product_names: "" });
      })
      .catch(() => alert("Failed to place order."));
  };

  // This will show a message if the store is not found
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

  // This will show an error if there is a server or network issue
  if (error === "server-error" || error === "network-error") {
    return (
      <div className="public-store-error">
        <h2>Something went wrong</h2>
        <p>Please try again later.</p>
      </div>
    );
  }

  // This will show a loading message while the store data is loading
  if (!storeData) {
    return <p>Loading store...</p>;
  }

  // This will filter products based on the search query
  const filteredProducts = storeData.products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="public-store-page">
      {/* This will display the store header and apply the store's theme color */}
      <div
        className="public-store-header"
        style={{
          backgroundColor: storeData.store.theme_color || "",
        }}
      >
        {storeData.store.logo_url && (
          <img
            src={storeData.store.logo_url}
            alt={`${storeData.store.name} logo`}
            className="public-store-logo"
          />
        )}
        <h1>{storeData.store.name}</h1>
        <p>{storeData.store.description}</p>

        {/* This is the search bar for filtering products */}
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="public-store-search"
        />
      </div>

      {/* This will display the products grid */}
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

      {/* This is the order form for purchasing products */}
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
          name="product_names"
          placeholder="Enter products you wish to buy (comma-separated)"
          value={orderForm.product_names}
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
