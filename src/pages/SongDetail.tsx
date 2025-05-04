// SongDetail.tsx // Diubah
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { SongType } from "./Songs"; // Diubah
import { CloseOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface SongDetailProps { // Diubah
  song: SongType; // Diubah
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SongDetail = ({ song, onClose, onEdit, onDelete }: SongDetailProps) => { // Diubah parameter & props
  const { getToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      // Diubah endpoint
      await axios.delete(`/api/songs/${song.id}`, { // Diubah
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      onDelete();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete song"); // Diubah
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
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden w-full max-w-3xl shadow-2xl transform transition-all">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-opacity-100 dark:hover:bg-opacity-100 z-10"
          >
            <CloseOutlined />
          </button>

          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/5 h-80 md:h-auto">
              {song.image_url ? ( // Diubah
                <img
                  src={song.image_url} // Diubah
                  alt={song.title} // Diubah
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300x400?text=Image+Not+Found";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">No Image</span>
                </div>
              )}
            </div>

            <div className="md:w-3/5 p-6 md:p-8">
              <div className="mb-5">
                <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs font-bold text-blue-800 dark:text-blue-200 mb-3">
                  {song.category?.name || "Uncategorized"} {/* Diubah */}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {song.title} {/* Diubah */}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Artist: {song.artist} {/* Diubah */}
                </p>
              </div>

              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
                <div className="flex">
                  <span className="w-28 font-medium">Added on:</span>
                  <span>{formatDate(song.created_at)}</span> {/* Diubah */}
                </div>

                {song.updated_at !== song.created_at && ( // Diubah
                  <div className="flex">
                    <span className="w-28 font-medium">Last updated:</span>
                    <span>{formatDate(song.updated_at)}</span> {/* Diubah */}
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onEdit}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                >
                  <EditOutlined /> Edit Song {/* Diubah */}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-5 py-2 bg-transparent border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2"
                >
                  <DeleteOutlined /> Delete
                </button>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 backdrop-blur-sm z-20">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full mx-4">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-3">
                  Confirm Deletion
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete "{song.title}"? This action cannot be undone. {/* Diubah */}
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Forever"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongDetail; // Diubah