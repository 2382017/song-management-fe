// CategoryList.tsx // Diubah
import { CategoryType } from "../pages/Category"; // Diubah
import { EyeOutlined, EditOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

interface CategoryListProps { // Diubah
  categories: CategoryType[]; // Diubah
  onEdit: (category: CategoryType) => void; // Diubah
  onView: (category: CategoryType) => void; // Diubah
  onPageChange: (page: number) => void;
  currentPage: number;
}

const CategoryList = ({ // Diubah
  categories, // Diubah
  onEdit,
  onView,
  onPageChange,
  currentPage
}: CategoryListProps) => { // Diubah
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 ml-2">All Categories</h2> {/* Diubah */}

      {categories.length === 0 ? ( // Diubah
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No categories found.</p> {/* Diubah */}
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add a new category to get started!</p> {/* Diubah */}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((category) => ( // Diubah
            <div
              key={category.id} // Diubah
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{category.name}</h3> {/* Diubah */}
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">{category.deskripsi}</p> {/* Diubah */}

                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-500 dark:text-gray-400">
                    {new Date(category.created_at).toLocaleDateString()} {/* Diubah */}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(category)} // Diubah
                      className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full p-2 hover:bg-blue-100 dark:hover:bg-blue-800/50"
                    >
                      <EyeOutlined />
                    </button>
                    <button
                      onClick={() => onEdit(category)} // Diubah
                      className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full p-2 hover:bg-green-100 dark:hover:bg-green-800/50"
                    >
                      <EditOutlined />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-10">
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center p-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-9 h-9 rounded-full disabled:opacity-50 flex items-center justify-center text-gray-500 dark:text-gray-400 disabled:text-gray-300 dark:disabled:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LeftOutlined />
          </button>
          <span className="px-4 py-1 mx-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-medium">
            {currentPage}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            // Tambahkan logika disable jika ini halaman terakhir (jika Anda punya total item)
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <RightOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryList; // Diubah