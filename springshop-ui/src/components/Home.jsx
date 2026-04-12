import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    let toastTimer;
    if (showToast) {
      toastTimer = setTimeout(() => setShowToast(false), 3000);
    }
    return () => clearTimeout(toastTimer);
  }, [showToast]);

  const convertBase64ToDataURL = (base64String, mimeType = 'image/jpeg') => {
    if (!base64String) return unplugged;
    if (base64String.startsWith('data:')) return base64String;
    if (base64String.startsWith('http')) return base64String;
    return `data:${mimeType};base64,${base64String}`;
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    setToastProduct(product);
    setShowToast(true);
  };

  const getStockBadge = (productAvailable, stockQuantity) => {
    if (!productAvailable || stockQuantity === 0) {
      return <span className="stock-badge stock-badge-out">Out of Stock</span>;
    }
    if (stockQuantity <= 5) {
      return <span className="stock-badge stock-badge-low">Low Stock</span>;
    }
    return <span className="stock-badge stock-badge-in">In Stock</span>;
  };

  const filteredProducts = selectedCategory
    ? data.filter((product) => product.category === selectedCategory)
    : data;

  if (isError) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="text-center">
          <img src={unplugged} alt="Error" className="img-fluid" width="100" />
          <h4 className="mt-3">Something went wrong</h4>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <div className={`toast ${showToast ? 'show' : 'hide'}`} role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header" style={{ background: "var(--gradient-primary)", color: "#fff" }}>
            <strong className="me-auto"><i className="bi bi-bag-check me-1"></i>Added to Cart</strong>
            <button type="button" className="btn-close btn-close-white" onClick={() => setShowToast(false)} aria-label="Close"></button>
          </div>
          <div className="toast-body">
            {toastProduct && (
              <div className="d-flex align-items-center">
                <img
                  src={convertBase64ToDataURL(toastProduct.imageData)}
                  alt={toastProduct.name}
                  className="me-2 rounded"
                  width="40"
                  height="40"
                  onError={(e) => { e.target.src = unplugged; }}
                />
                <div>
                  <div className="fw-bold">{toastProduct.name}</div>
                  <small className="text-muted">Successfully added to your cart!</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      {!selectedCategory && (
        <section className="hero-banner">
          <h1 className="animate-fade-in-up">Discover Smart Deals</h1>
          <p className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Powered by AI — explore products, get instant help from our chatbot,
            and enjoy a seamless shopping experience.
          </p>
          <Link to="/askai" className="btn btn-hero animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <i className="bi bi-robot me-2"></i>Chat with AI
          </Link>
        </section>
      )}

      {/* Product Grid */}
      <div className="container py-5" style={{ marginTop: selectedCategory ? "56px" : "0" }}>
        {selectedCategory && (
          <div className="d-flex align-items-center justify-content-between mb-4 mt-4">
            <h4 className="section-title mb-0">{selectedCategory}</h4>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => window.location.href = "/"}>
              <i className="bi bi-x-lg me-1"></i>Clear Filter
            </button>
          </div>
        )}

        {!selectedCategory && (
          <h4 className="section-title">All Products</h4>
        )}

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 animate-fade-in-up">
          {!filteredProducts || filteredProducts.length === 0 ? (
            <div className="col-12">
              <div className="empty-state">
                <i className="bi bi-box-seam d-block"></i>
                <h5>No Products Available</h5>
                <p className="text-muted">Check back soon or add some products!</p>
                <Link to="/add_product" className="btn gradient-btn mt-2">
                  <i className="bi bi-plus-circle me-1"></i>Add Product
                </Link>
              </div>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const { id, brand, name, price, productAvailable, imageData, stockQuantity, category } = product;

              return (
                <div className="col" key={id}>
                  <div className="card product-card h-100">
                    <Link to={`/product/${id}`} className="text-decoration-none text-dark">
                      <div className="card-img-wrapper">
                        {getStockBadge(productAvailable, stockQuantity)}
                        <img
                          src={convertBase64ToDataURL(imageData)}
                          alt={name}
                          className="p-3"
                          style={{ maxHeight: "200px", objectFit: "contain" }}
                          onError={(e) => { e.target.src = unplugged; }}
                        />
                      </div>
                      <div className="card-body d-flex flex-column">
                        <div className="mb-1">
                          <span className="badge bg-light text-dark border" style={{ fontSize: "0.7rem" }}>
                            {category}
                          </span>
                        </div>
                        <h6 className="card-title mb-1">{name}</h6>
                        <p className="product-brand mb-2">
                          <i className="bi bi-tag me-1"></i>{brand}
                        </p>
                        <div className="mt-auto">
                          <p className="product-price mb-2">
                            <i className="bi bi-currency-rupee"></i>{price}
                          </p>
                          <button
                            className="btn btn-add-cart w-100"
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={!productAvailable || stockQuantity === 0}
                          >
                            {stockQuantity !== 0 ? (
                              <><i className="bi bi-bag-plus me-1"></i>Add to Cart</>
                            ) : (
                              "Out of Stock"
                            )}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

