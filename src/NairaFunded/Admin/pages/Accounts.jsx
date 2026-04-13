import React, { useEffect, useState } from "react";
import AdminLayout from "../Layout";
import { Plus, CheckCircle2, AlertCircle, X } from "lucide-react";
import AddPlanModal from "../components/AddPlanModal";
import EditPlanModal from "../components/EditPlanModal";

const AccountPlans = () => {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newPlan, setNewPlan] = useState({
    size: "",
    price: "",
    type: "",
    loss: "",
    target: "",
    split: "",
  });

  const [editPlan, setEditPlan] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const plansPerPage = 10;

  const [message, setMessage] = useState({
    show: false,
    type: "",
    text: "",
  });

  const showMessage = (type, text) => {
    setMessage({
      show: true,
      type,
      text,
    });

    setTimeout(() => {
      setMessage({
        show: false,
        type: "",
        text: "",
      });
    }, 3000);
  };

  const closeMessage = () => {
    setMessage({
      show: false,
      type: "",
      text: "",
    });
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined || value === "") return "₦0";

    const cleanValue = String(value).replace(/[^0-9.]/g, "");
    const number = Number(cleanValue);

    if (Number.isNaN(number)) return `₦${value}`;

    return `₦${number.toLocaleString()}`;
  };

  const formatPercent = (value) => {
    if (value === null || value === undefined || value === "") return "0%";
    const cleanValue = String(value).replace("%", "").trim();
    return `${cleanValue}%`;
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch("https://fundednaira.ng/api/admin/get-plans.php");
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      showMessage("error", "Failed to fetch plans");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const addPlan = async () => {
    if (
      !newPlan.size ||
      !newPlan.price ||
      !newPlan.type ||
      !newPlan.loss ||
      !newPlan.target ||
      !newPlan.split
    ) {
      showMessage("error", "All fields are required");
      return;
    }

    try {
      const res = await fetch("https://fundednaira.ng/api/admin/add-plan.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlan),
      });

      const data = await res.json();

      if (data.success) {
        setShowModal(false);
        setNewPlan({
          size: "",
          price: "",
          type: "",
          loss: "",
          target: "",
          split: "",
        });

        fetchPlans();
        showMessage("success", "Plan added successfully");
      } else {
        showMessage("error", data.message || "Failed to add plan");
      }
    } catch (error) {
      console.error(error);
      showMessage("error", "Server error");
    }
  };

  const updatePlan = async () => {
    if (
      !editPlan.size ||
      !editPlan.price ||
      !editPlan.type ||
      !editPlan.loss ||
      !editPlan.target ||
      !editPlan.split
    ) {
      showMessage("error", "All fields are required");
      return;
    }

    try {
      const res = await fetch("https://fundednaira.ng/api/admin/update-plan.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editPlan),
      });

      const data = await res.json();

      if (data.success) {
        setShowEditModal(false);
        setEditPlan(null);
        fetchPlans();
        showMessage("success", "Plan updated successfully");
      } else {
        showMessage("error", data.message || "Failed to update plan");
      }
    } catch (error) {
      console.error(error);
      showMessage("error", "Server error");
    }
  };

  const deletePlan = async (id) => {
    try {
      const res = await fetch("https://fundednaira.ng/api/admin/delete-plan.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (data.success) {
        setShowEditModal(false);
        setEditPlan(null);
        fetchPlans();
        showMessage("success", "Plan deleted successfully");
      } else {
        showMessage("error", data.message || "Failed to delete plan");
      }
    } catch (error) {
      console.error(error);
      showMessage("error", "Server error");
    }
  };

  const indexOfLast = currentPage * plansPerPage;
  const indexOfFirst = indexOfLast - plansPerPage;
  const currentPlans = plans.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(plans.length / plansPerPage);

  return (
    <AdminLayout>
      <div className="p-6 text-white relative">
        {message.show && (
          <div className="fixed top-5 right-5 z-[100]">
            <div
              className={`flex items-start gap-3 min-w-[300px] max-w-[420px] rounded-2xl border px-4 py-4 shadow-2xl ${
                message.type === "success"
                  ? "bg-green-950/90 border-green-700 text-green-200"
                  : "bg-red-950/90 border-red-700 text-red-200"
              }`}
            >
              <div className="mt-0.5">
                {message.type === "success" ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
              </div>

              <div className="flex-1">
                <h4 className="font-semibold mb-1">
                  {message.type === "success" ? "Success" : "Error"}
                </h4>
                <p className="text-sm">{message.text}</p>
              </div>

              <button
                onClick={closeMessage}
                className="text-gray-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Account Plans</h2>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={16} />
            Add Plan
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-gray-800 bg-gray-950/40">
              <tr>
                <th className="px-4 py-3 text-left">Size</th>
                <th className="text-left">Price</th>
                <th className="text-left">Type</th>
                <th className="text-left">Max Loss</th>
                <th className="text-left">Target</th>
                <th className="text-left">Split</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentPlans.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-800 hover:bg-gray-800/70 transition"
                >
                  <td className="px-4 py-3">{formatMoney(p.size)}</td>
                  <td>{formatMoney(p.price)}</td>
                  <td>{p.type}</td>
                  <td>{formatPercent(p.loss)}</td>
                  <td>{formatPercent(p.target)}</td>
                  <td>{formatPercent(p.split)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setEditPlan(p);
                        setShowEditModal(true);
                      }}
                      className="rounded-lg bg-yellow-600/20 px-3 py-1.5 text-yellow-400 hover:bg-yellow-600/30"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentPlans.length === 0 && (
            <div className="p-6 text-center text-gray-400">
              No plans found
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6 items-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            Prev
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages || 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600"
                    : "bg-gray-800 hover:bg-gray-700"
                } transition`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages || 1))
            }
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            Next
          </button>
        </div>

        <AddPlanModal
          show={showModal}
          setShow={setShowModal}
          addPlan={addPlan}
          newPlan={newPlan}
          setNewPlan={setNewPlan}
        />

        <EditPlanModal
          show={showEditModal}
          setShow={setShowEditModal}
          editPlan={editPlan}
          setEditPlan={setEditPlan}
          updatePlan={updatePlan}
          deletePlan={deletePlan}
        />
      </div>
    </AdminLayout>
  );
};

export default AccountPlans;