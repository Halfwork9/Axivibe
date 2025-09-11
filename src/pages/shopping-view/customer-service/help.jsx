function HelpPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Help & FAQs</h1>

      <h2 className="text-xl font-semibold mt-4">Returns & Refunds</h2>
      <p className="mt-2 text-gray-700">
        We want you to love your purchase! If you are not satisfied, you can
        return most items within 7 days of delivery. Refunds will be processed
        to the original payment method within 5–7 business days.
      </p>

      <h2 className="text-xl font-semibold mt-6">Shipping Info</h2>
      <p className="mt-2 text-gray-700">
        Orders are typically processed within 1–2 business days. Standard
        delivery takes 3–5 days. Express delivery is available at extra cost.
        Tracking information will be sent via email once shipped.
      </p>

      <h2 className="text-xl font-semibold mt-6">FAQs</h2>
      <ul className="list-disc ml-6 mt-2 space-y-2 text-gray-700">
        <li>How do I track my order?</li>
        <li>How do I cancel or change my order?</li>
        <li>Do you ship internationally?</li>
        <li>How do I apply a discount code?</li>
      </ul>
    </div>
  );
}

export default HelpPage;
