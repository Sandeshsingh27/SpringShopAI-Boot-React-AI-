import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const Navbar = ({ onSelectCategory }) => {
  const { cart } = useContext(AppContext);

  const [input, setInput] = useState("");
  const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navbarRef = useRef(null);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavbarToggle = () => setIsNavCollapsed(!isNavCollapsed);
  const handleLinkClick = () => setIsNavCollapsed(true);

  const handleInputChange = (value) => setInput(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setShowNoProductsMessage(false);
    setIsLoading(true);
    setIsNavCollapsed(true);
    try {
      const response = await axios.get(
        `${baseUrl}/api/products/search?keyword=${input}`
      );
      if (response.data.length === 0) {
        setShowNoProductsMessage(true);
      } else {
        navigate(`/search-results`, { state: { searchData: response.data } });
      }
    } catch (error) {
      console.error("Error searching:", error);
      setShowNoProductsMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    onSelectCategory(category);
    setIsNavCollapsed(true);
  };

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
    "Other",
  ];

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-gradient" ref={navbarRef}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" onClick={handleLinkClick}>
          <i className="bi bi-lightning-charge-fill brand-icon"></i>
          SpringShop AI
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavbarToggle}
          aria-controls="navbarSupportedContent"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleLinkClick}>
                <i className="bi bi-house-door me-1"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add_product" onClick={handleLinkClick}>
                <i className="bi bi-plus-circle me-1"></i>Add Product
              </Link>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-grid me-1"></i>Categories
              </a>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={() => handleCategorySelect("")}>
                    All Products
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                {categories.map((category) => (
                  <li key={category}>
                    <button className="dropdown-item" onClick={() => handleCategorySelect(category)}>
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/askai" onClick={handleLinkClick}>
                <i className="bi bi-robot me-1"></i>Ask AI
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders" onClick={handleLinkClick}>
                <i className="bi bi-receipt me-1"></i>Orders
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <Link to="/cart" className="cart-link nav-link" onClick={handleLinkClick}>
              <i className="bi bi-bag"></i>
              {cartCount > 0 && (
                <span className="cart-badge badge">{cartCount}</span>
              )}
            </Link>

            <form className="d-flex nav-search-form" role="search" onSubmit={handleSubmit}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search products..."
                aria-label="Search"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              {isLoading ? (
                <button className="btn" type="button" disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                </button>
              ) : (
                <button className="btn" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              )}
            </form>

            {showNoProductsMessage && (
              <div className="alert alert-warning position-absolute mt-2" style={{ top: "100%", zIndex: 1000, right: 16 }}>
                No products found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



