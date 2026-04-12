import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import { toast } from "react-toastify";

const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(`${baseUrl}/api/product/${id}/image`, { responseType: "blob" });
      setImageUrl(URL.createObjectURL(response.data));
    };
    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`${baseUrl}/api/product/${id}`);
      removeFromCart(id);
      toast.success("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => navigate(`/product/update/${id}`);

  const handlAddToCart = () => {
    addToCart(product);
    toast.success("Product added to cart");
  };

  const getStockInfo = () => {
    if (!product.productAvailable || product.stockQuantity === 0) {
      return { label: "Out of Stock", className: "stock-badge-out", icon: "bi-x-circle" };
    }
    if (product.stockQuantity <= 5) {
      return { label: `Only ${product.stockQuantity} left`, className: "stock-badge-low", icon: "bi-exclamation-triangle" };
    }
    return { label: `${product.stockQuantity} in stock`, className: "stock-badge-in", icon: "bi-check-circle" };
  };

  if (!product) {
    return (
      <div className="container mt-5 pt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const stockInfo = getStockInfo();

  return (
    <div className="container mt-5 pt-5 animate-fade-in-up">
      <div className="card panel-card border-0 p-4" style={{ borderRadius: "var(--radius-lg)" }}>
        <div className="row g-4">
          {/* Product Image */}
          <div className="col-md-6">
            <div className="product-detail-img-wrapper">
              <img
                src={imageUrl}
                alt={product.name}
                className="img-fluid"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-6">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge bg-light text-dark border px-3 py-2">
                <i className="bi bi-grid me-1"></i>{product.category}
              </span>
              <small className="text-muted">
                <i className="bi bi-calendar3 me-1"></i>
                {new Date(product.releaseDate).toLocaleDateString()}
              </small>
            </div>

            <h2 className="fw-bold text-capitalize mb-1">{product.name}</h2>
            <p className="text-muted mb-4">
              <i className="bi bi-tag me-1"></i>{product.brand}
            </p>

            <div className="mb-4">
              <h6 className="text-muted text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>Description</h6>
              <p className="lh-lg">{product.description}</p>
            </div>

            <div className="d-flex align-items-center gap-3 mb-4">
              <h2 className="mb-0 fw-bold" style={{ color: "var(--primary)" }}>
                ₹ {product.price}
              </h2>
              <span className={`badge rounded-pill px-3 py-2 ${stockInfo.className}`} style={{ fontSize: "0.8rem", background: "transparent" }}>
                <i className={`bi ${stockInfo.icon} me-1`}></i>{stockInfo.label}
              </span>
            </div>

            <div className="d-grid gap-2 mb-4">
              <button
                className="btn btn-add-cart btn-lg py-3"
                onClick={handlAddToCart}
                disabled={!product.productAvailable || product.stockQuantity === 0}
              >
                {product.stockQuantity !== 0 ? (
                  <><i className="bi bi-bag-plus me-2"></i>Add to Cart</>
                ) : (
                  <><i className="bi bi-x-circle me-2"></i>Out of Stock</>
                )}
              </button>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary" type="button" onClick={handleEditClick}>
                <i className="bi bi-pencil me-1"></i>Update
              </button>
              <button className="btn btn-outline-danger" type="button" onClick={deleteProduct}>
                <i className="bi bi-trash me-1"></i>Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;

