import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { SongType, CategoryType } from "../pages/Songs"; // Diubah
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";

interface SongFormProps { // Diubah
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  song: SongType | null; // Diubah
  isEditMode: boolean;
  categories: CategoryType[]; // Diubah
}

interface FormData {
  title: string;
  artist: string; // Diubah
  categoryId: number; // Diubah
  imageUrl: string;
}

const SongForm = ({ // Diubah
  isOpen,
  onClose,
  onSubmit,
  song, // Diubah
  isEditMode,
  categories // Diubah
}: SongFormProps) => { // Diubah
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Diubah properti formData
  const [formData, setFormData] = useState<FormData>({
    title: "",
    artist: "", // Diubah
    categoryId: categories.length > 0 ? categories[0].id : 0, // Diubah
    imageUrl: ""
  });

  useEffect(() => {
    if (isEditMode && song) { // Diubah
      // Diubah properti formData & sumber data
      setFormData({
        title: song.title, // Diubah
        artist: song.artist, // Diubah
        categoryId: song.category_id || (categories.length > 0 ? categories[0].id : 0), // Diubah
        imageUrl: song.image_url // Diubah
      });
    }
    // Diubah dependensi
  }, [isEditMode, song, categories]); // Diubah

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      // Diubah pengecekan nama field
      [name]: name === "categoryId" ? parseInt(value, 10) : value // Diubah
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (isEditMode && song) { // Diubah
        // Update existing song - Diubah endpoint
        await axios.put(`/api/songs/${song.id}`, formData, { // Diubah
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      } else {
        // Create new song - Diubah endpoint
        await axios.post("/api/songs", formData, { // Diubah
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      }
      onSubmit();
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while saving the song"); // Diubah
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-100 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {isEditMode ? "Edit Song" : "Add New Song"} {/* Diubah */}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <CloseOutlined className="text-xl" />
            </button>
          </div>
          <p className="text-blue-100 mt-1">
            {isEditMode ? "Update your song details" : "Add a new song to your collection"} {/* Diubah */}
          </p>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Song Title {/* Diubah */}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the title of the song" // Diubah
              />
            </div>

            <div>
              <label htmlFor="artist" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> {/* Diubah htmlFor */}
                Artist {/* Diubah */}
              </label>
              <input
                type="text"
                id="artist" // Diubah id
                name="artist" // Diubah name
                required
                value={formData.artist} // Diubah value
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the artist's name" // Diubah
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"> {/* Diubah htmlFor */}
                Category {/* Diubah */}
              </label>
              <select
                id="categoryId" // Diubah id
                name="categoryId" // Diubah name
                required
                value={formData.categoryId} // Diubah value
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.length === 0 && ( // Diubah
                  <option value="">No categories available</option> // Diubah
                )}
                {/* Diubah loop dan properti */}
                {categories.map((category) => ( // Diubah
                  <option key={category.id} value={category.id}> {/* Diubah */}
                    {category.name} {/* Diubah */}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL {/* Bisa juga diubah jadi Cover Art URL jika diinginkan */}
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the image URL (optional)"
              />
            </div>

            {formData.imageUrl && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Image Preview:</p>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-44 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <SaveOutlined /> {isSubmitting ? "Saving..." : isEditMode ? "Update Song" : "Save Song"} {/* Diubah */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SongForm; // Diubah