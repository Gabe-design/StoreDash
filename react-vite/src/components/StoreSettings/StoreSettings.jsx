// react-vite/src/components/StoreSettings/StoreSettings.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkGetMyStore, thunkUpdateMyStore, thunkDeleteMyStore, thunkCreateMyStore, clearStore } from "../../redux/storeSettings";
// import Sidebar from "../Sidebar/Sidebar";
import "./StoreSettings.css";

// This is the store settings page where users can customize their store
function StoreSettings() {
  // This will dispatch actions to get, create, update, and delete the store
  const dispatch = useDispatch();
  // This will navigate to different pages
  const navigate = useNavigate();

  // This will get the current store data from Redux
  const store = useSelector((state) => state.store.current);

  // This will store the form inputs locally
  const [formData, setFormData] = useState({
    // This is for the store name
    name: "",
    // This is for the store logo URL
    logo_url: "",
    // This is for the store theme color
    theme_color: "#000000",
    // This is for the store description
    description: "",
  });

  // This will store a preview for the logo
  const [logoPreview, setLogoPreview] = useState("");

  // This will store any errors returned from the server
  const [errors, setErrors] = useState({});

  // This will disable the Save button if inputs are invalid
  const isValid =
    formData.name.trim().length > 0 &&
    formData.theme_color.trim().length > 0 &&
    formData.description.trim().length > 0 &&
    (formData.logo_url.trim().length > 0 || logoPreview.length > 0);

  // When component mounts, fetch the current user's store
  useEffect(() => {
    dispatch(thunkGetMyStore());
  }, [dispatch]);

  // When store data changes in Redux, it will update the form fields
  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name || "",
        logo_url: store.logo_url || "",
        theme_color: store.theme_color || "#000000",
        description: store.description || "",
      });
      setLogoPreview(store.logo_url || "");
    } else {
      // This is so if no store exists, it will reset the form
      setFormData({
        name: "",
        logo_url: "",
        theme_color: "#000000",
        description: "",
      });
      setLogoPreview("");
    }
  }, [store]);

  // This will handle text/color input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // This will handle form submission to create or update the store
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    let serverErrors;
    if (store) {
      // If a store exists, update it
      serverErrors = await dispatch(thunkUpdateMyStore(formData));
    } else {
      // If no store exists, create a new one
      serverErrors = await dispatch(thunkCreateMyStore(formData));
    }

    if (serverErrors) {
      setErrors(serverErrors);
    } else {
      navigate("/dashboard");
    }
  };

  // This will handle store deletion
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your store? This action cannot be undone.")) {
      const serverErrors = await dispatch(thunkDeleteMyStore());
      if (!serverErrors) {
        // This will clear Redux store immediately
        dispatch(clearStore());

        // This will reset the form instantly after deleting
        setFormData({
          name: "",
          logo_url: "",
          theme_color: "#000000",
          description: "",
        });
        setLogoPreview("");

        // Redirect user to dashboard after delete
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar
      <Sidebar /> */}

      {/* This is the main customization content */}
      <main className="dashboard-main">
        <h2 className="store-settings-title">Store Customization</h2>

        <form onSubmit={handleSubmit} className="store-settings-form">
          {/* This is the store name */}
          <label className="store-settings-label">
            Store name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="store-settings-input"
              placeholder="Store name"
              required
            />
          </label>
          {errors.name && <p className="store-settings-error">{errors.name}</p>}

          {/* This is the logo URL */}
          <label className="store-settings-label">
            Logo upload (URL)
            <input
              type="text"
              name="logo_url"
              value={formData.logo_url}
              onChange={handleChange}
              className="store-settings-input"
              placeholder="Image URL"
            />
          </label>

          {/* This is the logo preview */}
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Store Logo Preview"
              className="store-settings-logo-preview"
            />
          )}

          {/* This is the theme color */}
          <label className="store-settings-label">
            Theme color
            <input
              type="color"
              name="theme_color"
              value={formData.theme_color}
              onChange={handleChange}
              className="store-settings-color"
            />
          </label>

          {/* This is the description */}
          <label className="store-settings-label">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="store-settings-textarea"
              placeholder="Description"
            />
          </label>
          {errors.description && (
            <p className="store-settings-error">{errors.description}</p>
          )}

          {/* This is the save button */}
          <button
            type="submit"
            className="store-settings-button"
            disabled={!isValid}
          >
            {store ? "Update Store" : "Create Store"}
          </button>

          {/* This is the delete button (will only show if a store exists) */}
          {store && (
            <button
              type="button"
              className="store-settings-delete-button"
              onClick={handleDelete}
            >
              Delete Store
            </button>
          )}
        </form>
      </main>
    </div>
  );
}

export default StoreSettings;
