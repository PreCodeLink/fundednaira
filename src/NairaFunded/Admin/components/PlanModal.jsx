import { X } from "lucide-react";

const AddPlanModal = ({ show, setShow, addPlan, newPlan, setNewPlan }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-md relative">

        {/* Close */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3"
        >
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">Add Account Plan</h2>

        <div className="space-y-3">

          <input placeholder="Account Size"
            className="w-full p-2 bg-gray-800 rounded"
            onChange={(e) => setNewPlan({ ...newPlan, size: e.target.value })}
          />

          <input placeholder="Price"
            className="w-full p-2 bg-gray-800 rounded"
            onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
          />

          <select
            className="w-full p-2 bg-gray-800 rounded"
            onChange={(e) => setNewPlan({ ...newPlan, type: e.target.value })}
          >
            <option>Type</option>
            <option>Challenge</option>
            <option>Instant</option>
          </select>

          <input placeholder="Max Loss (%)"
            className="w-full p-2 bg-gray-800 rounded"
            onChange={(e) => setNewPlan({ ...newPlan, loss: e.target.value })}
          />

          <input placeholder="Profit Target (%)"
            className="w-full p-2 bg-gray-800 rounded"
            onChange={(e) => setNewPlan({ ...newPlan, target: e.target.value })}
          />

          <input placeholder="Profit Split (%)"
            className="w-full p-2 bg-gray-800 rounded"
            onChange={(e) => setNewPlan({ ...newPlan, split: e.target.value })}
          />

          <input placeholder="Flutterwave Payment Link"
            className="w-full p-2 bg-gray-800 rounded"
            onChange={(e) => setNewPlan({ ...newPlan, link: e.target.value })}
          />

          <button
            onClick={addPlan}
            className="w-full py-2 bg-green-600 rounded-lg"
          >
            Save Plan
          </button>

        </div>
      </div>
    </div>
  );
};

export default AddPlanModal;