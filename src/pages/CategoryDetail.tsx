import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { CategoryType } from "./Category";
import { CloseCircleOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";

interface CategoryDetailProps {
  category: CategoryType;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryDetail = ({
  category,
  onClose,
  onEdit,
  onDelete
}: CategoryDetailProps) => {
  const { getToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`/api/category/${category.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      onDelete();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete category");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-slate-900 to-indigo-950 rounded-3xl overflow-hidden w-full max-w-lg animate-slideUp border border-indigo-500/30 shadow-2xl shadow-indigo-500/20">
        {/* Header with background image pattern */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-800 h-40 overflow-hidden">
          {/* Abstract pattern background */}
          <div className="absolute inset-0 opacity-20">
            {Array(20).fill(0).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white/30"
                style={{
                  width: `${20 + Math.random() * 50}px`,
                  height: `${20 + Math.random() * 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.1 + (Math.random() * 0.3)
                }}
              />
            ))}
          </div>

          <div className="absolute top-0 right-0 m-4">
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            >
              <CloseCircleOutlined style={{ fontSize: '18px' }} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h2 className="text-lg font-medium opacity-80">Category Details</h2>
            <h1 className="text-3xl font-bold mt-1 drop-shadow">{category.name}</h1>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-6 bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="p-6 text-slate-200">
          <div className="mb-6">
            <h4 className="text-xs uppercase tracking-wide text-indigo-400 font-semibold mb-3">
              Deskripsi
            </h4>
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-indigo-500/20 shadow-inner">
              <p className="text-slate-300 whitespace-pre-line">{category.deskripsi}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-xs uppercase tracking-wide text-indigo-400 font-semibold mb-2 flex items-center">
                <CalendarOutlined className="mr-1" /> Created
              </h4>
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-3 border border-indigo-500/20 shadow-inner">
                <p className="text-slate-300">{formatDate(category.created_at)}</p>
              </div>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wide text-indigo-400 font-semibold mb-2 flex items-center">
                <ClockCircleOutlined className="mr-1" /> Updated
              </h4>
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-3 border border-indigo-500/20 shadow-inner">
                <p className="text-slate-300">{formatDate(category.updated_at)}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-8">
            <button
              onClick={onEdit}
              className="flex-1 py-3 bg-indigo-800/50 hover:bg-indigo-700/50 text-white rounded-xl flex items-center justify-center gap-2 transition-colors border border-indigo-500/30"
            >
              <EditOutlined /> Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 py-3 bg-red-900/30 hover:bg-red-800/50 text-red-300 rounded-xl flex items-center justify-center gap-2 transition-colors border border-red-500/30"
            >
              <DeleteOutlined /> Delete
            </button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="p-6 border-t border-indigo-500/20 bg-slate-900/80 backdrop-blur">
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-slate-300 mb-4">
              Are you sure you want to delete <span className="font-semibold text-white">"{category.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2 bg-slate-800 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl disabled:opacity-50 border border-red-500"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;