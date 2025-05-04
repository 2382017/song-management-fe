import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { SongType, CategoryType } from "../pages/Songs"; // Adjust path if needed
import { CloseOutlined, SaveOutlined, LoadingOutlined, PictureOutlined } from "@ant-design/icons"; // Added PictureOutlined

interface SongFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  song: SongType | null;
  isEditMode: boolean;
  categories: CategoryType[];
}

// Keep interface - logic unchanged
interface FormData {
  title: string;
  artist: string;
  categoryId: number | string; // Allow string for initial empty option
  imageUrl: string;
}

const SongForm = ({
  isOpen,
  onClose,
  onSubmit,
  song,
  isEditMode,
  categories,
}: SongFormProps) => {
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For image preview

  // Same logic for initial state - ensuring categoryId starts empty for placeholder
  const [formData, setFormData] = useState<FormData>({
    title: "",
    artist: "",
    categoryId: "", // Start with empty string
    imageUrl: "",
  });

  // Same logic for populating form in edit mode
  useEffect(() => {
    if (isOpen) { // Reset/Populate only when opening
        if (isEditMode && song) {
            setFormData({
                title: song.title || "",
                artist: song.artist || "",
                categoryId: song.category_id || "", // Use '' if null/0
                imageUrl: song.image_url || "",
            });
            setImagePreview(song.image_url || null);
        } else {
            // Reset form for new entry
            setFormData({ title: "", artist: "", categoryId: "", imageUrl: "" });
            setImagePreview(null);
            setError(""); // Clear errors on open
        }
    }
  }, [isEditMode, song, isOpen]); // Depend on isOpen to trigger effect


  // Same logic for handling changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Ensure categoryId is stored as number if selected, otherwise empty string
      [name]: name === "categoryId" ? (value ? parseInt(value, 10) : "") : value,
    }));

    // Update image preview immediately if imageUrl changes
    if (name === "imageUrl") {
        // Basic URL validation could be added here
        setImagePreview(value);
    }
  };

  // Same submit logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Basic Validation
    if (!formData.title.trim() || !formData.artist.trim() || !formData.categoryId) {
      setError("Please fill in Title, Artist, and select a Category.");
      return;
    }
    // Optional: Validate imageUrl format
    if (formData.imageUrl && !formData.imageUrl.startsWith('http')) {
        setError("Image URL must be a valid URL (e.g., start with http).");
        return;
    }


    setIsSubmitting(true);

    // Prepare data, ensure categoryId is number
    const submissionData = {
        ...formData,
        categoryId: Number(formData.categoryId), // Convert '' or number string to number
        // Ensure imageUrl is sent as null or empty string if not provided, depending on backend needs
        imageUrl: formData.imageUrl || "", // Or null if backend prefers
    };

    try {
      if (isEditMode && song) {
        await axios.put(`/api/songs/${song.id}`, submissionData, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
      } else {
        await axios.post("/api/songs", submissionData, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
      }
      onSubmit(); // Calls parent's function (refetch, close modal)
    } catch (err: any) {
       const apiError = err.response?.data?.message || err.message || "An error occurred";
       console.error("Form submission error:", err.response || err);
       // Provide more specific error feedback if possible (e.g., check for validation errors from backend)
       if (err.response?.data?.errors) {
           const validationErrors = Object.values(err.response.data.errors).flat().join(' ');
           setError(`Validation failed: ${validationErrors}`);
       } else {
           setError(`Failed to save: ${apiError}.`);
       }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // New Modal Styling: Dark, clean form layout
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fadeIn">
      {/* Increased z-index */}
      <div className="bg-gradient-to-br from-[#1a1131] to-[#1f1438] rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-purple-800/50 animate-scaleIn">

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-purple-800/50 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">
            {isEditMode ? "Edit Track" : "Add New Track"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            disabled={isSubmitting}
            aria-label="Close form"
          >
            <CloseOutlined className="text-xl" />
          </button>
        </div>

        {/* Form Area with Scrolling */}
        {/* Add id here so button outside can reference it */}
        <form id="song-form-main" onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-grow">

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/40 border border-red-700/50 text-red-300 px-3 py-2 rounded text-sm mb-4" role="alert">
              {error}
            </div>
          )}

          {/* Form Fields */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-purple-300 mb-1">Track Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-purple-900/30 border border-purple-700/50 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors disabled:opacity-70"
              placeholder="e.g., Bohemian Rhapsody"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="artist" className="block text-sm font-medium text-purple-300 mb-1">Artist <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="artist"
              name="artist"
              required
              value={formData.artist}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-purple-900/30 border border-purple-700/50 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors disabled:opacity-70"
              placeholder="e.g., Queen"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-purple-300 mb-1">Category <span className="text-red-500">*</span></label>
            <select
              id="categoryId"
              name="categoryId"
              required
              value={formData.categoryId} // Value is now string or number
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-purple-900/30 border border-purple-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors appearance-none disabled:opacity-70 ${formData.categoryId ? 'text-gray-200' : 'text-gray-500'}`} // Dynamic text color for placeholder
              disabled={isSubmitting || categories.length === 0}
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }} // Custom arrow
            >
              <option value="" disabled className="text-gray-500">-- Select Category --</option>
              {categories.length === 0 && (
                <option value="" disabled>No categories available</option>
              )}
              {categories.map((category) => (
                <option key={category.id} value={category.id} className="bg-[#1f1438] text-gray-200">
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-purple-300 mb-1">Cover Image URL (Optional)</label>
            <input
              type="url" // Use type="url" for better semantics/validation
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-purple-900/30 border border-purple-700/50 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors disabled:opacity-70"
              placeholder="https://..."
              disabled={isSubmitting}
            />
          </div>

          {/* Image Preview */}
          {imagePreview ? (
                <div className="mt-3">
                    <p className="text-sm text-purple-300 mb-1">Image Preview:</p>
                    <img
                        src={imagePreview}
                        alt="Cover preview"
                        className="w-24 h-24 object-cover rounded-md border border-purple-700/50"
                        // Add onError to clear preview if URL is invalid *after* leaving the input
                        onError={(e) => {
                             // Optionally clear preview if URL is invalid
                             // setImagePreview(null);
                             // Or replace with a placeholder
                             (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96x96?text=Invalid';
                        }}
                    />
                </div>
             ) : (
                 // Optional: Show a placeholder box if no image URL yet
                 formData.imageUrl && ( // Only show placeholder if URL field has text but preview failed/loading
                     <div className="mt-3">
                        <p className="text-sm text-purple-300 mb-1">Image Preview:</p>
                        <div className="w-24 h-24 flex items-center justify-center rounded-md border border-dashed border-purple-700/50 bg-purple-900/20">
                            <PictureOutlined className="text-3xl text-purple-500/50"/>
                        </div>
                     </div>
                 )
            )}

        </form> {/* End of Form */}

         {/* Footer with Actions */}
         <div className="flex justify-end gap-3 p-5 border-t border-purple-800/50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/70 text-gray-200 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit" // Standard submit button type
              form="song-form-main" // Links button to the form above using its ID
              disabled={isSubmitting || !formData.title || !formData.artist || !formData.categoryId} // Basic disable condition
              className={`px-4 py-2 flex items-center justify-center gap-2 text-white text-sm font-medium rounded-md transition-all duration-300 shadow-md ${isSubmitting || !formData.title || !formData.artist || !formData.categoryId ? 'bg-gray-600 opacity-70 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:shadow-pink-500/30 transform hover:scale-105'}`}
            >
              {isSubmitting ? <LoadingOutlined className="animate-spin" /> : <SaveOutlined />}
              {isSubmitting ? "Saving..." : isEditMode ? "Update Track" : "Save Track"}
            </button>
         </div>

      </div> {/* End of Modal container */}
    </div> // End of Backdrop
  );
};

export default SongForm;