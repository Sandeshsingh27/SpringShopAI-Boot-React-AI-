import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import { Link } from "react-router-dom";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import unplugged from "../assets/unplugged.png";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (cart.length) {
      setCartItems(cart);
    } else {
      setCartItems([]);
    }
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(item.quantity - 1, 1) } : item
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const convertBase64ToDataURL = (base64String, mimeType = 'image/jpeg') => {
    if (!base64String) return unplugged;
    if (base64String.startsWith('data:')) return base64String;
    if (base64String.startsWith('http')) return base64String;
    return `data:${mimeType};base64,${base64String}`;
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } = item;
        const updatedStockQuantity = item.stockQuantity - item.quantity;
        const updatedProductData = { ...rest, stockQuantity: updatedStockQuantity };
        const cartProduct = new FormData();
        cartProduct.append("imageFile", cartImage);
        cartProduct.append("product", new Blob([JSON.stringify(updatedProductData)], { type: "application/json" }));
        await axios.put(`${baseUrl}/api/product/${item.id}`, cartProduct, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.log("error during checkout", error);
    }
  };

  return (
    <div className="container mt-5 pt-5 animate-fade-in-up">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card panel-card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-bag me-2"></i>
                Shopping Cart ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
              </h5>
            </div>
            <div className="card-body">
              {cartItems.length === 0 ? (
                <div className="empty-state py-5">
                  <i className="bi bi-bag-x d-block"></i>
                  <h5>Your cart is empty</h5>
                  <p className="text-muted">Looks like you haven't added anything yet.</p>
                  <Link to="/" className="btn gradient-btn mt-2">
                    <i className="bi bi-arrow-left me-1"></i>Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle cart-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={convertBase64ToDataURL(item.imageData)}
                                  alt={item.name}
                                  className="rounded me-3"
                                  width="64"
                                  height="64"
                                  style={{ objectFit: "cover", background: "#f8fafc" }}
                                />
                                <div>
                                  <h6 className="mb-0 fw-bold">{item.name}</h6>
                                  <small className="text-muted">{item.brand}</small>
                                </div>
                              </div>
                            </td>
                            <td className="fw-semibold">₹ {item.price}</td>
                            <td>
                              <div className="input-group input-group-sm" style={{ width: "110px" }}>
                                <button className="btn btn-outline-secondary" type="button" onClick={() => handleDecreaseQuantity(item.id)}>
                                  <i className="bi bi-dash"></i>
                                </button>
                                <input type="text" className="form-control text-center fw-bold" value={item.quantity} readOnly />
                                <button className="btn btn-outline-secondary" type="button" onClick={() => handleIncreaseQuantity(item.id)}>
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td className="fw-bold" style={{ color: "var(--primary)" }}>
                              ₹ {(item.price * item.quantity).toFixed(2)}
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveFromCart(item.id)}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="card cart-summary mt-3 border-0">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="text-muted">Subtotal</span>
                          <h3 className="mb-0 fw-bold" style={{ color: "var(--primary)" }}>
                            ₹ {totalPrice.toFixed(2)}
                          </h3>
                        </div>
                        <button className="btn gradient-btn btn-lg px-5" onClick={() => setShowModal(true)}>
                          <i className="bi bi-credit-card me-2"></i>Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;

