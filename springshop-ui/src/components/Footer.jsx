import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white fw-bold mb-3">
              <i className="bi bi-lightning-charge-fill me-2"></i>
              SpringShop AI
            </h5>
            <p className="mb-3" style={{ fontSize: "0.9rem" }}>
              Your AI-powered e-commerce platform. Discover smart deals,
              get instant support from our intelligent chatbot, and enjoy
              a seamless shopping experience.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="GitHub"><i className="bi bi-github"></i></a>
              <a href="#" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
              <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/">Home</Link></li>
              <li className="mb-2"><Link to="/add_product">Add Product</Link></li>
              <li className="mb-2"><Link to="/orders">My Orders</Link></li>
              <li className="mb-2"><Link to="/cart">Cart</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div className="col-lg-3 col-md-6">
            <h6>Features</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/askai"><i className="bi bi-robot me-1"></i>AI Assistant</Link></li>
              <li className="mb-2"><span><i className="bi bi-cpu me-1"></i>AI Product Generation</span></li>
              <li className="mb-2"><span><i className="bi bi-image me-1"></i>AI Image Generation</span></li>
              <li className="mb-2"><span><i className="bi bi-search me-1"></i>Smart Search</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6">
            <h6>Contact</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i>support@springshop.ai
              </li>
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>Powered by Spring Boot & React
              </li>
              <li className="mb-2">
                <i className="bi bi-cpu me-2"></i>Ollama + Mistral AI
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom text-center">
          <p className="mb-0">
            © {new Date().getFullYear()} SpringShop AI — Built with
            <i className="bi bi-heart-fill text-danger mx-1"></i>
            using Spring Boot, React & AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

