'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Star, Package, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const mockReviewOrder = {
  id: 'ORD-1038',
  items: [{ name: 'Teff Flour 2kg', qty: 1 }],
};

export default function ReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || mockReviewOrder.id;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    setSubmitting(true);
    // TODO: replace with real API call to submit review
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
    toast.success('Review submitted, thank you!');
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rounded-full bg-emerald-100 p-4 w-fit mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-xl font-bold text-stone-900 mb-2">Thanks for your review!</h1>
        <p className="text-stone-500 text-sm mb-6">Your feedback helps other shoppers and sellers improve.</p>
        <Button onClick={() => router.push('/orders')}>Back to Orders</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Rate your order</h1>
        <p className="text-stone-500 text-sm mt-1">
          Order <span className="font-mono font-semibold text-stone-700">{orderId}</span>
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-stone-100">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-50 border border-stone-100">
              <Package className="h-5 w-5 text-stone-400" />
            </div>
            <div>
              {mockReviewOrder.items.map((item, i) => (
                <p key={i} className="text-sm font-medium text-stone-900">
                  {item.name} <span className="text-stone-400">× {item.qty}</span>
                </p>
              ))}
            </div>
          </div>

          <p className="text-sm font-medium text-stone-700 mb-3">How was your experience?</p>
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-9 w-9 ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-stone-100 text-stone-200'
                  }`}
                />
              </button>
            ))}
          </div>

          <label className="text-sm font-medium text-stone-700 mb-1.5 block">
            Share your thoughts <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others about the product quality, delivery, and seller..."
            rows={4}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none"
          />

          <Button onClick={handleSubmit} loading={submitting} className="w-full mt-5">
            Submit Review
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}