// CategoryForm.tsx // Diubah
import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { CategoryType } from "../pages/Category"; // Diubah
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";

interface CategoryFormProps { // Diubah
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  category: CategoryType | null; // Diubah
  isEditMode: boolean;
}

interface FormData {
  name: string;
  deskripsi: string; // Diubah
}

const CategoryForm = ({ // Diubah
  isOpen,
  onClose,
  onSubmit,
  category, // Diubah
  isEditMode
}: CategoryFormProps) => { // Diubah
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    deskripsi: "" // Diubah
  });

  useEffect(() => {
    // If editing an existing category, populate the form // Diubah
    if (isEditMode && category) { // Diubah
      setFormData({
        name: category.name, // Diubah
        deskripsi: category.deskripsi // Diubah
      });
    } else {
      // Reset form for new category // Diubah
      setFormData({
        name: "",
        deskripsi: "" // Diubah
      });
    }
  }, [isEditMode, category]); // Diubah

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (isEditMode && category) { // Diubah
        // Update existing category // Diubah
        await axios.put(`/api/category/${category.id}`, formData, { // Diubah
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      } else {
        // Create new category // Diubah
        await axios.post("/api/category", formData, { // Diubah
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      }
      onSubmit();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "An error occurred while saving the category" // Diubah
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-100 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md animate-slideIn">
        {/* Header */}
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-purple-600 to-blue-500 rounded-t-2xl"></div>
          <div className="relative pt-16 px-6 pb-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-700 rounded-full shadow-lg border-4 border-white dark:border-gray-700 mb-2">
              <span className="text-2xl">{isEditMode ? "✏️" : "✨"}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {isEditMode ? "Edit Category" : "Create New Category"} {/* Diubah */}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isEditMode ? "Update the category details below" : "Fill in the details to create a new category"} {/* Diubah */}
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
          >
            <CloseOutlined />
          </button>
        </div>

        {error && (
          <div className="mx-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 pt-3">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Category Name {/* Diubah */}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-shadow"
              placeholder="Enter category name..." /* Diubah */
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="deskripsi" // Diubah
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Deskripsi {/* Diubah */}
            </label>
            <textarea
              id="deskripsi" // Diubah
              name="deskripsi" // Diubah
              required
              value={formData.deskripsi} // Diubah
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition-shadow"
              placeholder="Provide a detailed deskripsi for this category..." /* Diubah */
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-3 text-sm bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <SaveOutlined />{" "}
              {isSubmitting ? "Saving..." : isEditMode ? "Update Category" : "Create Category"} {/* Diubah */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm; // Diubah