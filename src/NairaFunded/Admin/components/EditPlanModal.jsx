import { X, Trash2 } from "lucide-react";

const EditPlanModal = ({
  show,
  setShow,
  editPlan,
  setEditPlan,
  updatePlan,
  deletePlan,
}) => {
  if (!show || !editPlan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-900 p-6">
        <button
          onClick={() => setShow(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X />
        </button>

        <h2 className="mb-5 text-xl font-bold text-white">Edit Plan</h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            value={editPlan.size || ""}
            onChange={(e) =>
              setEditPlan({ ...editPlan, size: e.target.value })
            }
            placeholder="Account Size"
            className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500"
          />

          <input
            value={editPlan.price || ""}
            onChange={(e) =>
              setEditPlan({ ...editPlan, price: e.target.value })
            }
            placeholder="Price"
            className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500"
          />

          <select
            value={editPlan.type || ""}
            onChange={(e) =>
              setEditPlan({ ...editPlan, type: e.target.value })
            }
            className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500"
          >
            <option value="">Select Type</option>
            <option value="Instant">Instant</option>
            <option value="Challenge">Challenge</option>
          </select>

          <input
            value={editPlan.loss || ""}
            onChange={(e) =>
              setEditPlan({ ...editPlan, loss: e.target.value })
            }
            placeholder="Max Loss"
            className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500"
          />

          <input
            value={editPlan.target || ""}
            onChange={(e) =>
              setEditPlan({ ...editPlan, target: e.target.value })
            }
            placeholder="Profit Target"
            className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500"
          />

          <input
            value={editPlan.split || ""}
            onChange={(e) =>
              setEditPlan({ ...editPlan, split: e.target.value })
            }
            placeholder="Profit Split"
            className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={updatePlan}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Update Plan
          </button>

          <button
            onClick={() => deletePlan(editPlan.id)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-medium text-white transition hover:bg-red-700"
          >
            <Trash2 size={18} />
            Delete Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlanModal;