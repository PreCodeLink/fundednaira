import { X } from "lucide-react";

const AddPlanModal = ({
  show,
  setShow,
  addPlan,
  newPlan,
  setNewPlan,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">

        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </button>

        <h2 className="mb-5 text-xl font-bold text-white">Add Plan</h2>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

          <input
            placeholder="Account Size"
            value={newPlan.size || ""}
            onChange={(e) =>
              setNewPlan({ ...newPlan, size: e.target.value })
            }
            className="p-3 bg-gray-800 rounded-lg text-white border border-gray-700"
          />

          <input
            placeholder="Price"
            value={newPlan.price || ""}
            onChange={(e) =>
              setNewPlan({ ...newPlan, price: e.target.value })
            }
            className="p-3 bg-gray-800 rounded-lg text-white border border-gray-700"
          />

          <select
            value={newPlan.type || ""}
            onChange={(e) =>
              setNewPlan({ ...newPlan, type: e.target.value })
            }
            className="p-3 bg-gray-800 rounded-lg text-white border border-gray-700"
          >
            <option value="">Select Type</option>
            <option value="Instant">Instant</option>
            <option value="Challenge">Challenge</option>
          </select>

          <input
            placeholder="Max Loss"
            value={newPlan.loss || ""}
            onChange={(e) =>
              setNewPlan({ ...newPlan, loss: e.target.value })
            }
            className="p-3 bg-gray-800 rounded-lg text-white border border-gray-700"
          />

          <input
            placeholder="Profit Target"
            value={newPlan.target || ""}
            onChange={(e) =>
              setNewPlan({ ...newPlan, target: e.target.value })
            }
            className="p-3 bg-gray-800 rounded-lg text-white border border-gray-700"
          />

          <input
            placeholder="Profit Split"
            value={newPlan.split || ""}
            onChange={(e) =>
              setNewPlan({ ...newPlan, split: e.target.value })
            }
            className="p-3 bg-gray-800 rounded-lg text-white border border-gray-700"
          />

        </div>

        {/* Button */}
        <button
          onClick={addPlan}
          className="w-full mt-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Add Plan
        </button>
      </div>
    </div>
  );
};

export default AddPlanModal;