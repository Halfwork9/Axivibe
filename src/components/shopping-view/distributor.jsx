import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState,useEffect } from "react";
import api from "@/api";

function DistributorPage() {
  const [formData, setFormData] = useState({
    company: "",
    contactName: "",
    title: "",
    phone: "",
    email: "",
    markets: "",
  });
  const [error, setError] = useState(""); // 👈 inline error
  const [success, setSuccess] = useState("");
  const [existingApp, setExistingApp] = useState(null);

  // Fetch existing application when component loads
useEffect(() => {
  const fetchApp = async () => {
    try {
      const res = await api.get("/distributors/status", {
        withCredentials: true, // axios needs this, not credentials: 'include'
      });
      if (res.data.success) {
        setExistingApp(res.data.data);
      } else {
        setExistingApp(null);
      }
    } catch (err) {
      setExistingApp(null);
    }
  };
  fetchApp();
}, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  try {
    const res = await api.post("/distributors", formData, {
      withCredentials: true,
    });

    if (res.data.success) {
      setSuccess("Application submitted successfully!");
      setExistingApp(res.data.data); // 👈 immediately show status box
      setFormData({
        company: "",
        contactName: "",
        title: "",
        phone: "",
        email: "",
        markets: "",
      });
    } else {
      setError(res.data.message || "Something went wrong.");
    }
  } catch {
    setError("Error submitting application. Please try again.");
  }
};



  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Subscribed successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Become a Distributor</h1>
        <p className="max-w-2xl mx-auto text-lg">
          Join our global partner network and grow your business with our
          premium products.
        </p>
      </section>

      {/* Application Process */}
      <section className="py-16 px-6 container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Application Process
        </h2>
        <p className="text-center mb-12 max-w-2xl mx-auto">
          We are looking for passionate partners to represent our brand. Complete
          our simple application process to get started.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Online Application",
              desc: "Complete our simple online form with your company details and background.",
            },
            {
              step: "2",
              title: "Discovery Call",
              desc: "Let’s discuss how we can work together to achieve mutual success.",
            },
            {
              step: "3",
              title: "Final Approval",
              desc: "Welcome to our partner network! Let’s start this exciting journey together.",
            },
          ].map((item, idx) => (
            <Card key={idx} className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Distributor Application Form */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            Distributor Application Form
          </h2>
         {existingApp ? (
           <div className="p-6 border rounded bg-gray-50 text-center">
            <p className="mb-2">✅ You have already applied.</p>
            <p>
              <strong>Status:</strong> {existingApp.status}
            </p>
            <p>
               <strong>Submitted on:</strong>{" "}
               {new Date(existingApp.createdAt).toLocaleDateString()}
             </p>
           </div>
        ) : (
           <>
            {error && <p className="text-red-600 mb-4">{error}</p>}
             {success && <p className="text-green-600 mb-4">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Company *</Label>
              <Input
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Contact Name *</Label>
              <Input
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div> 
            <div>
              <Label>Phone *</Label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>
                What channels/markets do you currently (or anticipate selling)
                sell into? *
              </Label>
              <Input
                name="markets"
                value={formData.markets}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
           </>
         )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="container mx-auto max-w-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="mb-6 text-gray-600">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Input type="email" placeholder="Your email address" required />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default DistributorPage;





