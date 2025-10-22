import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

function Footer() {
  const [openSection, setOpenSection] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sections = [
    {
      title: "About Us",
      content: (
        <p className="text-sm">
          Your trusted destination for fashion and lifestyle products. We bring
          you the latest collections from top brands at the best prices.
        </p>
      ),
    },
    {
      title: "Customer Service",
      content: (
        <ul className="space-y-2 text-sm">
          <li><Link to="/shop/help" className="hover:text-white">Help & FAQs</Link></li>
          <li><Link to="/shop/product-support" className="hover:text-white">Product Support</Link></li>
          <li><Link to="/shop/technical-support" className="hover:text-white">Technical Support</Link></li>
          <li><Link to="/shop/contact" className="hover:text-white">Contact Us</Link></li>
          <li><Link to="/shop/distributor" className="hover:text-white">Become a Distributor</Link></li>
        </ul>
      ),
    },
    {
      title: "Quick Links",
      content: (
        <ul className="space-y-2 text-sm">
          <li><Link to="/shop/home" className="hover:text-white">Home</Link></li>
          <li><Link to="/shop/listing" className="hover:text-white">Products</Link></li>
          <li><Link to="/shop/account" className="hover:text-white">My Account</Link></li>
          <li><Link to="/shop/cart" className="hover:text-white">Cart</Link></li>
        </ul>
      ),
    },
    {
      title: "Get in Touch",
      content: (
        <ul className="space-y-2 text-sm">
          <li>Email: support@ecommerce.com</li>
          <li>Phone: +91 98765 43210</li>
          <li>Address: 123 Market Street, Mumbai, India</li>
        </ul>
      ),
    },
  ];

  return (
    <footer className="relative bg-gray-900 text-gray-400">
      <div className="hidden md:grid container mx-auto px-6 py-12 grid-cols-1 md:grid-cols-4 gap-8">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-lg font-semibold text-white mb-3">{section.title}</h3>
            {section.content}
          </div>
        ))}
      </div>
      <div className="md:hidden container mx-auto px-6 py-8 space-y-4">
        {sections.map((section, idx) => (
          <div key={idx}>
            <button
              className="w-full flex justify-between items-center text-lg font-semibold text-white"
              onClick={() => toggleSection(idx)}
            >
              {section.title}
              <span>{openSection === idx ? "−" : "+"}</span>
            </button>
            {openSection === idx && <div className="mt-2">{section.content}</div>}
          </div>
        ))}
      </div>
      <div className="border-t border-gray-700 py-4 text-center text-sm">
        © {new Date().getFullYear()} Ecommerce. All rights reserved.
      </div>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/80 transition"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  );
}

export default Footer;
