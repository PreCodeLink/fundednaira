import React from "react";
import { X } from "lucide-react";

const FeedbackModal = ({ feedback, setFeedback }) => {
  if (!feedback) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl p-6 text-white relative">
        <button
          onClick={() => setFeedback(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-semibold mb-5">Feedback Details</h3>

        <div className="space-y-4 text-sm">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Name</p>
              <p>{feedback.name}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Email</p>
              <p>{feedback.email}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Type</p>
              <p>{feedback.type}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Rating</p>
              <p>{feedback.rating}/5</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 md:col-span-2">
              <p className="text-gray-400 text-xs mb-1">Date</p>
              <p>{feedback.created_at}</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-2">Message</p>
            <p className="leading-7 whitespace-pre-line">{feedback.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;