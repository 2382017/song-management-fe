import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import CategoryList from "../components/CategoryList"; // Diubah
import CategoryForm from "../components/CategoryForm"; // Diubah
import CategoryDetail from "./CategoryDetail"; // Diubah
import { PlusOutlined } from "@ant-design/icons";

export type CategoryType = { // Diubah
  id: number;
  name: string;
  deskripsi: string; // Diubah
  user_id: number;
  created_at: string;
  updated_at: string;
};

const fetchCategoryList = async ( // Diubah
  token: string | null,
  page = 1,
  limit = 10
) => {
  return await axios.get<CategoryType[]>( // Diubah
    `/api/category?page=${page}&limit=${limit}`, // Diubah
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

const Category = () => { // Diubah
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>( // Diubah
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: categoryData, refetch: refetchCategory } = useQuery({ // Diubah
    queryKey: ["categoryList", currentPage], // Diubah
    queryFn: () => fetchCategoryList(getToken(), currentPage) // Diubah
  });

  const handleAddNewClick = () => {
    setSelectedCategory(null); // Diubah
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditClick = (category: CategoryType) => { // Diubah
    setSelectedCategory(category); // Diubah
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleViewClick = (category: CategoryType) => { // Diubah
    setSelectedCategory(category); // Diubah
    setIsFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleCloseDetail = () => {
    setSelectedCategory(null); // Diubah
  };

  const handleFormSubmit = () => {
    refetchCategory(); // Diubah
    setIsFormOpen(false);
  };

  const handleDeleteSuccess = () => {
    refetchCategory(); // Diubah
    setSelectedCategory(null); // Diubah
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-400">
            Category Library {/* Diubah */}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your collection
          </p>
        </div>

        <div className="p-5">
          <button
            onClick={handleAddNewClick}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <PlusOutlined /> Create New Category {/* Diubah */}
          </button>
        </div>

        <div className="p-5 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Total Categories: {categoryData?.data.length || 0}</p> {/* Diubah */}
            <p className="mt-2">Current Page: {currentPage}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        {categoryData && ( // Diubah
          <CategoryList // Diubah
            categories={categoryData.data} // Diubah
            onEdit={handleEditClick}
            onView={handleViewClick}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        )}

        {isFormOpen && (
          <CategoryForm // Diubah
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
            category={isEditMode ? selectedCategory : null} // Diubah
            isEditMode={isEditMode}
          />
        )}

        {selectedCategory && !isFormOpen && ( // Diubah
          <CategoryDetail // Diubah
            category={selectedCategory} // Diubah
            onClose={handleCloseDetail}
            onEdit={() => handleEditClick(selectedCategory)} // Diubah
            onDelete={handleDeleteSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Category; // Diubah