"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { addReview } from "@/actions/server/review";
import StarRating from "@/components/ui/StarRating";
import { formatDate } from "@/lib/format";

const ReviewSection = ({ productId, reviews = [], averageRating = 0, totalReviews = 0 }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const payload = {
      productId,
      rating: form.rating.value,
      title: form.title.value,
      message: form.message.value,
    };

    const result = await addReview(payload);
    setLoading(false);
    if (!result.success) {
      Swal.fire("Review", result.message || "Could not submit review.", "error");
      return;
    }

    form.reset();
    await Swal.fire("Review", result.message, "success");
    window.location.reload();
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Customer Reviews</h3>
            <p className="mt-1 text-base-content/60">Verified buyers can rate and review their purchases.</p>
          </div>
          <div className="text-right">
            <StarRating value={averageRating} />
            <p className="mt-1 text-sm text-base-content/60">{totalReviews} review(s)</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {reviews.length ? reviews.map((review) => (
            <div key={review._id} className="rounded-2xl border border-base-300 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{review.userName}</p>
                  <p className="text-xs text-base-content/50">{formatDate(review.createdAt || review.updatedAt)}</p>
                </div>
                <StarRating value={review.rating} small />
              </div>
              {review.title ? <h4 className="mt-3 font-semibold">{review.title}</h4> : null}
              <p className="mt-2 text-sm leading-6 text-base-content/70">{review.message}</p>
            </div>
          )) : (
            <div className="rounded-2xl bg-base-200 p-5 text-sm text-base-content/60">No reviews yet. Be the first verified customer to share feedback.</div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
        <div>
          <h3 className="text-2xl font-bold">Write a Review</h3>
          <p className="mt-1 text-sm text-base-content/60">A customer can review after purchasing the product.</p>
        </div>
        <div>
          <label className="label"><span className="label-text">Rating</span></label>
          <select name="rating" className="select select-bordered w-full" defaultValue="5">
            {[5,4,3,2,1].map((item)=><option key={item} value={item}>{item} Star</option>)}
          </select>
        </div>
        <div>
          <label className="label"><span className="label-text">Headline</span></label>
          <input name="title" className="input input-bordered w-full" placeholder="Loved the build quality" />
        </div>
        <div>
          <label className="label"><span className="label-text">Review</span></label>
          <textarea name="message" className="textarea textarea-bordered w-full" rows={5} placeholder="Share what you liked about the product..." required />
        </div>
        <button disabled={loading} className="btn btn-primary w-full">{loading ? "Submitting..." : "Submit Review"}</button>
      </form>
    </section>
  );
};

export default ReviewSection;
