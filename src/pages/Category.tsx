import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import CategoryList from "../components/CategoryList";
import CategoryForm from "../components/CategoryForm";
import CategoryDetail from "./CategoryDetail";
import { PlusCircleOutlined } from "@ant-design/icons";

export type CategoryType = {
  id: number;
  name: string;
  deskripsi: string;
  user_id: number;
  created_at: string;
  updated_at: string;
};

const fetchCategoryList = async (
  token: string | null,
  page = 1,
  limit = 10
) => {
  return await axios.get<CategoryType[]>(
    `/api/category?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

const Category = () => {
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: categoryData, refetch: refetchCategory } = useQuery({
    queryKey: ["categoryList", currentPage],
    queryFn: () => fetchCategoryList(getToken(), currentPage)
  });

  const handleAddNewClick = () => {
    setSelectedCategory(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleViewClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleCloseDetail = () => {
    setSelectedCategory(null);
  };

  const handleFormSubmit = () => {
    refetchCategory();
    setIsFormOpen(false);
  };

  const handleDeleteSuccess = () => {
    refetchCategory();
    setSelectedCategory(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar - Now at the top for mobile, left for larger screens */}
          <div className="md:w-72 lg:w-80 bg-black/40 backdrop-blur-xl p-6 md:border-r border-white/10">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">📂</span>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">Categories</h1>
                <p className="text-indigo-200 text-sm opacity-80">Organize your collection</p>
              </div>
            </div>
            
            <button
              onClick={handleAddNewClick}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-2xl text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 font-medium transition-all duration-300 mb-8"
            >
              <PlusCircleOutlined /> New Category
            </button>

            <div className="space-y-4 text-indigo-200">
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur">
                <div className="text-sm">
                  <div className="flex justify-between mb-2">
                    <span>Total Categories</span>
                    <span className="text-white font-medium">{categoryData?.data.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Page</span>
                    <span className="text-white font-medium">{currentPage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            {categoryData && (
              <CategoryList
                categories={categoryData.data}
                onEdit={handleEditClick}
                onView={handleViewClick}
                onPageChange={handlePageChange}
                currentPage={currentPage}
              />
            )}
          </div>
        </div>
      </div>

      {isFormOpen && (
        <CategoryForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          category={isEditMode ? selectedCategory : null}
          isEditMode={isEditMode}
        />
      )}

      {selectedCategory && !isFormOpen && (
        <CategoryDetail
          category={selectedCategory}
          onClose={handleCloseDetail}
          onEdit={() => handleEditClick(selectedCategory)}
          onDelete={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Category;