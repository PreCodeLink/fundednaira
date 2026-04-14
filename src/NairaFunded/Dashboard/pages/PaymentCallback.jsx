import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Verifying payment...");
  const [rawResponse, setRawResponse] = useState("");

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      setMessage("Missing payment reference");
      setLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;

    const checkPayment = async () => {
      try {
        const res = await fetch(
          `https://api.fundednaira.ng/api/payments/verify-payment.php?reference=${encodeURIComponent(reference)}`
        );

        const text = await res.text();
        setRawResponse(text);

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          setMessage("Invalid server response");
          setLoading(false);
          return;
        }

        if (data.success) {
          setMessage(data.message || "Payment successful");
          setLoading(false);

          setTimeout(() => {
            navigate("/dashboard/acc");
          }, 1500);
          return;
        }

        if (
          data.message &&
          data.message.toLowerCase().includes("pending") &&
          attempts < maxAttempts
        ) {
          attempts += 1;
          setMessage(`Payment received. Confirming... (${attempts}/${maxAttempts})`);
          setTimeout(checkPayment, 3000);
          return;
        }

        setMessage(data.message || "Payment verification failed");
        setLoading(false);
      } catch (error) {
        console.error(error);
        setMessage("Server error while verifying payment");
        setLoading(false);
      }
    };

    checkPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">
          {loading ? "Processing Payment..." : "Payment Status"}
        </h1>

        <p className="text-gray-300 mb-6">{message}</p>

        {rawResponse && (
          <div className="text-left bg-black/30 border border-gray-800 rounded-xl p-4 overflow-auto">
            <p className="text-sm text-gray-400 mb-2">Raw server response</p>
            <pre className="text-xs text-red-300 whitespace-pre-wrap break-words">
              {rawResponse}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;