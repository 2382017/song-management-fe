import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { CategoryType } from "../pages/Category";
import { CloseOutlined, SaveOutlined, FormOutlined, FileTextOutlined } from "@ant-design/icons";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  category: CategoryType | null;
  isEditMode: boolean;
}

interface FormData {
  name: string;
  deskripsi: string;
}

const CategoryForm = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  isEditMode
}: CategoryFormProps) => {
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    deskripsi: ""
  });

  useEffect(() => {
    // If editing an existing category, populate the form
    if (isEditMode && category) {
      setFormData({
        name: category.name,
        deskripsi: category.deskripsi
      });
    } else {
      // Reset form for new category
      setFormData({
        name: "",
        deskripsi: ""
      });
    }
  }, [isEditMode, category]);

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
      if (isEditMode && category) {
        // Update existing category
        await axios.put(`/api/category/${category.id}`, formData, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      } else {
        // Create new category
        await axios.post("/api/category", formData, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      }
      onSubmit();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "An error occurred while saving the category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-3xl overflow-hidden w-full max-w-md animate-slideIn border border-indigo-500/30 shadow-xl">
        {/* Header with animated pattern */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600 overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              {Array(8).fill(0).map((_, i) => (
                <div 
                  key={i}
                  className="absolute bg-white/30 rounded-full blur-xl"
                  style={{
                    width: `${40 + Math.random() * 80}px`,
                    height: `${40 + Math.random() * 80}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `pulse ${3 + Math.random() * 5}s infinite alternate`
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="relative py-10 px-6 text-center">
            <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-lg text-white rounded-2xl flex items-center justify-center border border-white/20 shadow-lg mb-4">
              {isEditMode ? <FormOutlined style={{ fontSize: '24px' }} /> : <FileTextOutlined style={{ fontSize: '24px' }} />}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {isEditMode ? "Edit Category" : "Create New Category"}
            </h2>
            <p className="text-blue-200/80 text-sm">
              {isEditMode ? "Update your category information" : "Add a new category to your collection"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 backdrop-blur-lg rounded-full p-2 transition-colors"
          >
            <CloseOutlined />
          </button>
        </div>

        {error && (
          <div className="mx-6 -mt-2 mb-4 bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 pt-4 bg-slate-900 bg-opacity-90">
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-indigo-300 mb-2"
            >
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-400 transition-shadow"
              placeholder="Enter category name..."
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="deskripsi"
              className="block text-sm font-medium text-indigo-300 mb-2"
            >
              Deskripsi
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              required
              value={formData.deskripsi}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 bg-slate-800/50 border border-indigo-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-400 transition-shadow"
              placeholder="Provide a detailed description for this category..."
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-800/30"
            >
              <SaveOutlined />{" "}
              {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;