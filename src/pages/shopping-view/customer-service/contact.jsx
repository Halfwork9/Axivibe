function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-700 mb-4">
        Have questions? We’re here to help! Reach out to us using the details below:
      </p>

      <ul className="space-y-3 text-gray-700">
        <li><strong>Email:</strong> support@ecommerce.com</li>
        <li><strong>Phone:</strong> +91 98765 43210</li>
        <li><strong>Address:</strong> 123 Market Street, Mumbai, India</li>
      </ul>

      <p className="mt-6 text-gray-700">
        Our customer service team is available Monday to Saturday, 9:00 AM to 6:00 PM IST.
      </p>
    </div>
  );
}

export default ContactPage;
