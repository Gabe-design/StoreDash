// src/components/StoreSettings/StoreSettings.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkGetMyStore, thunkUpdateMyStore } from "../../redux/storeSettings";
import "./StoreSettings.css";

function StoreSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // This will get the current store data from Redux
  const store = useSelector((state) => state.store.current);

  // This will store the form inputs locally
  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
    theme_color: "#000000",
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

  // When store data changes in Redux, updatews the form fields
  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name || "",
        logo_url: store.logo_url || "",
        theme_color: store.theme_color || "#000000",
        description: store.description || "",
      });
      setLogoPreview(store.logo_url || "");
    }
  }, [store]);

  // This will handle text/color input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // This will handle file upload for the logo
  const handleLogoFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      uploadLogo(file);
    }
  };

  // This will upload the file and set the logo URL
  const uploadLogo = (file) => {
    const formDataObj = new FormData();
    formDataObj.append("image", file);

    fetch("/api/images/upload", {
      method: "POST",
      body: formDataObj,
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData((prev) => ({ ...prev, logo_url: data.url }));
      })
      .catch((err) => console.error("Error uploading logo:", err));
  };

  // This will handle form submission to update the store
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const serverErrors = await dispatch(thunkUpdateMyStore(formData));
    if (serverErrors) {
      setErrors(serverErrors);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="store-settings-page">
      <h2 className="store-settings-title">Store Customization</h2>

      <form onSubmit={handleSubmit} className="store-settings-form">
        {/* Store Name */}
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

        {/* Logo URL */}
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

        {/* File Upload */}
        <label className="store-settings-label">
          Or choose file
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoFile}
            className="store-settings-file"
          />
        </label>

        {/* Logo Preview */}
        {logoPreview && (
          <img
            src={logoPreview}
            alt="Store Logo Preview"
            className="store-settings-logo-preview"
          />
        )}

        {/* Theme Color */}
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

        {/* Description */}
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

        {/* Save Button */}
        <button
          type="submit"
          className="store-settings-button"
          disabled={!isValid}
        >
          Save
        </button>
      </form>
    </div>
  );
}

export default StoreSettings;
