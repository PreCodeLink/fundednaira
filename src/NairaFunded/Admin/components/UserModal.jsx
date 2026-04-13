import { X } from "lucide-react";

const UserToggleModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full max-w-lg p-6 rounded-2xl shadow-2xl relative border border-gray-700">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
            {user.name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              {user.name}
            </h2>
            <p className="text-sm text-gray-400">{user.email}</p>

            <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
              user.status === "Active"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}>
              {user.status}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-3 rounded-xl text-center">
            <p className="text-sm text-gray-400">Accounts</p>
            <p className="text-white font-bold">
              {user.totalAccounts || 0}
            </p>
          </div>

          <div className="bg-gray-800 p-3 rounded-xl text-center">
            <p className="text-sm text-gray-400">Reffarals</p>
            <p className="text-white font-bold">
              {user.ref || "0"}
            </p>
          </div>

          <div className="bg-gray-800 p-3 rounded-xl text-center">
            <p className="text-sm text-gray-400">Payouts</p>
            <p className="text-white font-bold">
              ₦{user.payouts || "0"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button className="py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition">
            Activate
          </button>

          <button className="py-2 bg-yellow-600 rounded-lg text-white hover:bg-yellow-700 transition">
            Suspend
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserToggleModal;