// SongDetail.tsx
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { SongType } from "./Songs"; // Adjust path if needed
import {
    CloseOutlined,
    EditOutlined,
    DeleteOutlined,
    HeartOutlined,
    HeartFilled,
    PlayCircleOutlined,
    CalendarOutlined,
    UserOutlined,
    TagOutlined
} from "@ant-design/icons";

interface SongDetailProps {
  song: SongType;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SongDetail = ({ song, onClose, onEdit, onDelete }: SongDetailProps) => {
  const { getToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false); // Visual only state

  // Same delete logic
  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");
    try {
      await axios.delete(`/api/songs/${song.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      onDelete(); // Close modal and refetch list via parent
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete song");
      setIsDeleting(false); // Keep confirm dialog open on error
      // Don't setShowDeleteConfirm(false) on error, let user retry or cancel
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  return (
    // New Modal Styling: Dark, glassy, focused
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-[100] p-4 animate-fadeIn" // Increased z-index
    >
      <div
        className="relative bg-gradient-to-bl from-[#1d133a] via-[#150d2a] to-[#100a1f] rounded-2xl w-full max-w-3xl shadow-2xl border border-purple-800/40 overflow-hidden animate-scaleIn"
        style={{ boxShadow: "0 10px 50px rgba(128, 90, 213, 0.2)" }} // Purple glow
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 p-2 rounded-full text-gray-300 hover:text-white transition-all z-20"
          aria-label="Close details"
        >
          <CloseOutlined />
        </button>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12">
           {/* Left Side - Image */}
           <div className="md:col-span-5 relative aspect-square md:aspect-auto h-64 md:h-auto">
                {song.image_url ? (
                    <img
                      src={song.image_url}
                      alt={`${song.title} cover`}
                      className="absolute inset-0 w-full h-full object-cover"
                       onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Audio'; }}
                    />
                ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
                      <PlayCircleOutlined className="text-6xl text-white/20" />
                    </div>
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#150d2a] via-transparent to-transparent md:bg-gradient-to-r md:from-[#150d2a] md:via-[#150d2a]/80 md:to-transparent"></div>
           </div>

           {/* Right Side - Details */}
           <div className="md:col-span-7 p-6 sm:p-8 relative z-10 flex flex-col justify-between min-h-[300px] md:min-h-0">
               <div> {/* Info container */}
                    {/* Category & Favorite */}
                    <div className="flex justify-between items-center mb-3">
                        <span className="inline-flex items-center gap-1.5 bg-purple-800/50 text-purple-200 text-xs font-medium px-2.5 py-1 rounded-full">
                            <TagOutlined/> {song.category?.name || "Uncategorized"}
                        </span>
                        <button onClick={toggleFavorite} title="Toggle favorite">
                            {isFavorite ? <HeartFilled className="text-pink-500 text-xl" /> : <HeartOutlined className="text-gray-400 hover:text-pink-400 text-xl transition-colors" />}
                        </button>
                    </div>

                    {/* Title and Artist */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 leading-tight">{song.title}</h1>
                    <p className="text-lg text-purple-300 flex items-center gap-2 mb-6">
                        <UserOutlined/> {song.artist}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-2 text-sm border-t border-purple-800/50 pt-4">
                        <div className="flex items-center gap-2 text-gray-400">
                            <CalendarOutlined className="text-purple-400"/>
                            <span>Added: {formatDate(song.created_at)}</span>
                            {song.updated_at !== song.created_at && (
                                <span className="ml-2 pl-2 border-l border-gray-700">Updated: {formatDate(song.updated_at)}</span>
                            )}
                        </div>
                        {/* Add more details if available in your model or just for show */}
                        {/* <div className="flex items-center gap-2 text-gray-400"><ClockCircleOutlined className="text-purple-400"/> <span>Duration: 3:45</span></div> */}
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mt-4 bg-red-900/50 border border-red-700/50 text-red-300 px-3 py-2 rounded text-sm">
                        {error}
                        </div>
                    )}
               </div>

               {/* Action Buttons */}
               <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onEdit}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-purple-500/30 transition-all duration-300"
                    >
                        <EditOutlined /> Edit
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-red-600/70 text-red-400 hover:bg-red-900/30 hover:text-red-300 font-semibold py-2.5 px-4 rounded-lg transition-colors duration-300"
                    >
                        <DeleteOutlined /> Delete
                    </button>
               </div>
           </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-30 p-4">
            <div className="bg-gradient-to-br from-[#100a1f] to-[#1f1438] p-6 rounded-xl shadow-2xl max-w-sm w-full border border-purple-800/50 animate-scaleIn">
              <h3 className="text-lg font-semibold text-red-400 mb-3">Confirm Deletion</h3>
              <p className="text-gray-300 text-sm mb-6">
                Permanently delete "{song.title}"? This cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-1.5 bg-gray-700/50 hover:bg-gray-600/70 text-gray-200 text-sm rounded-md transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className={`px-4 py-1.5 text-sm rounded-md flex items-center gap-1 transition-all ${isDeleting ? 'bg-red-800 opacity-70 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
                        Deleting...
                      </>
                   ) : (
                      <> <DeleteOutlined /> Delete </>
                   )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongDetail;