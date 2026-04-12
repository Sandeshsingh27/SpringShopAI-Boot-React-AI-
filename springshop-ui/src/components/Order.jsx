import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Order = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/orders`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, [baseUrl]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PLACED': return 'status-placed';
      case 'SHIPPED': return 'status-shipped';
      case 'DELIVERED': return 'status-delivered';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'bg-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PLACED': return 'bi-bag-check';
      case 'SHIPPED': return 'bi-truck';
      case 'DELIVERED': return 'bi-check-circle';
      case 'CANCELLED': return 'bi-x-circle';
      default: return 'bi-question-circle';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);
  };

  const calculateOrderTotal = (items) => items.reduce((total, item) => total + item.totalPrice, 0);

  if (loading) {
    return (
      <div className="container mt-5 pt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 pt-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>{error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5 animate-fade-in-up">
      <h2 className="section-title mt-3">Order Management</h2>

      <div className="card panel-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-receipt me-2"></i>Orders
          </h5>
          <span className="badge bg-light text-dark">{orders.length} total</span>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)" }}>Order ID</th>
                  <th style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)" }}>Customer</th>
                  <th style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)" }}>Date</th>
                  <th style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)" }}>Status</th>
                  <th style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)" }}>Items</th>
                  <th style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)" }}>Total</th>
                  <th style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)" }}></th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      <div className="empty-state py-5">
                        <i className="bi bi-inbox d-block"></i>
                        <h5>No orders yet</h5>
                        <p className="text-muted">Orders will appear here once placed.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <React.Fragment key={order.orderId}>
                      <tr>
                        <td>
                          <span className="fw-bold font-monospace" style={{ fontSize: "0.85rem" }}>{order.orderId}</span>
                        </td>
                        <td>
                          <div className="fw-semibold">{order.customerName}</div>
                          <div className="text-muted" style={{ fontSize: "0.8rem" }}>{order.email}</div>
                        </td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${getStatusClass(order.status)} px-3 py-2`}>
                            <i className={`bi ${getStatusIcon(order.status)} me-1`}></i>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">{order.items.length}</span>
                        </td>
                        <td className="fw-bold">{formatCurrency(calculateOrderTotal(order.items))}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => toggleOrderDetails(order.orderId)}
                          >
                            <i className={`bi ${expandedOrder === order.orderId ? 'bi-chevron-up' : 'bi-chevron-down'} me-1`}></i>
                            {expandedOrder === order.orderId ? 'Hide' : 'Details'}
                          </button>
                        </td>
                      </tr>
                      {expandedOrder === order.orderId && (
                        <tr>
                          <td colSpan="7" className="p-0">
                            <div className="p-3" style={{ background: "linear-gradient(135deg, #f0f0ff 0%, #faf5ff 100%)" }}>
                              <h6 className="mb-3 fw-bold">
                                <i className="bi bi-box-seam me-2"></i>Order Items
                              </h6>
                              <div className="table-responsive">
                                <table className="table table-sm mb-0 bg-white" style={{ borderRadius: "var(--radius-sm)" }}>
                                  <thead>
                                    <tr>
                                      <th>Product</th>
                                      <th className="text-center">Quantity</th>
                                      <th className="text-end">Price</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, index) => (
                                      <tr key={index}>
                                        <td className="fw-semibold">{item.productName}</td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-end">{formatCurrency(item.totalPrice)}</td>
                                      </tr>
                                    ))}
                                    <tr style={{ background: "var(--gradient-primary)", color: "#fff" }}>
                                      <td colSpan="2" className="text-end fw-bold">Order Total</td>
                                      <td className="text-end fw-bold">{formatCurrency(calculateOrderTotal(order.items))}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;