import { X } from "lucide-react";

const PaymentModal = ({
  payment,
  setPayment,
  approve,
  reject,
  loading,
}) => {
  if (!payment) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md relative">

        {/* Close */}
        <button
          onClick={() => setPayment(null)}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">Payment Details</h2>

        <div className="space-y-2 text-sm">
          <p><b>User:</b> {payment.user}</p>
          <p><b>Amount:</b> {payment.amount}</p>
          <p><b>Method:</b> {payment.method}</p>
          <p><b>Status:</b> {payment.status}</p>
          {payment.reference && (
            <p><b>Ref:</b> {payment.reference}</p>
          )}
        </div>

        {/* Actions */}
        {payment.status === "Pending" && (
          <div className="flex gap-3 mt-6">

            <button
              onClick={approve}
              disabled={loading}
              className="flex-1 py-2 bg-green-600 rounded-lg disabled:opacity-50"
            >
              {loading ? "Processing..." : "Approve"}
            </button>

            <button
              onClick={reject}
              disabled={loading}
              className="flex-1 py-2 bg-red-600 rounded-lg disabled:opacity-50"
            >
              Reject
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;