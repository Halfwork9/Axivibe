import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import api from "@/api";

export default function ProductReviewSection({ productId, user }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewValue, setReviewValue] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = () => {
    setLoading(true);
    api.get(`/shop/review/${productId}`)
      .then(res => setReviews(res.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewValue || !reviewMessage.trim()) return;
    setSubmitting(true);
    try {
      await api.post("/shop/review/add", {
        productId,
        userId: user.id,
        userName: user.userName,
        reviewMessage,
        reviewValue
      });
      setReviewValue(0);
      setReviewMessage("");
      fetchReviews();
      alert("Thank you for your review!");
    } catch (err) {
      alert(err?.response?.data?.message || "Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto my-6">
      <h3 className="font-bold text-lg mb-3">Customer Reviews</h3>
      {user && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-4 rounded-lg mb-6 shadow flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">Your rating:</span>
            {[1, 2, 3, 4, 5].map(v => (
              <button
                type="button"
                key={v}
                className={`text-yellow-400 ${v <= reviewValue ? "fill-yellow-400" : "fill-gray-300"}`}
                onClick={() => setReviewValue(v)}
                tabIndex={-1}
              >
                <Star fill={v <= reviewValue ? "#eab308" : "#e5e7eb"} className="w-6 h-6" />
              </button>
            ))}
          </div>
          <textarea
            className="border rounded w-full p-2"
            rows={3}
            placeholder="Share your thoughts about this product"
            value={reviewMessage}
            onChange={e => setReviewMessage(e.target.value)}
            required
          />
          <button
            className="self-end px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/80 disabled:opacity-60"
            type="submit"
            disabled={submitting || !reviewValue || !reviewMessage}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {loading ? (
        <div>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div>No reviews yet for this product.</div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review._id} className="border-b pb-4">
              <div className="flex items-center gap-2">
                <span className="font-bold">{review.userName}</span>
                <span className="flex">
                  {[1, 2, 3, 4, 5].map(v => (
                    <Star
                      key={v}
                      fill={v <= review.reviewValue ? "#eab308" : "#e5e7eb"}
                      className="w-4 h-4"
                    />
                  ))}
                </span>
              </div>
              <div className="mt-1">{review.reviewMessage}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
