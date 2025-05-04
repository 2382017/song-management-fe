import { CategoryType } from "../pages/Category";
import { EyeOutlined, EditOutlined, ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useState } from "react";

interface CategoryListProps {
  categories: CategoryType[];
  onEdit: (category: CategoryType) => void;
  onView: (category: CategoryType) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
}

const CategoryList = ({
  categories,
  onEdit,
  onView,
  onPageChange,
  currentPage
}: CategoryListProps) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-8">Categories Collection</h2>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center bg-black/20 backdrop-blur-sm rounded-3xl border border-indigo-500/20 p-8 shadow-lg">
          <div className="w-20 h-20 bg-indigo-900/50 rounded-full flex items-center justify-center mb-4 border border-indigo-500/20">
            <span className="text-4xl">📚</span>
          </div>
          <h3 className="text-xl font-bold text-indigo-300 mb-2">No Categories Found</h3>
          <p className="text-indigo-200/70 max-w-md">
            Your category collection is empty. Create your first category to start organizing your content.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="relative overflow-hidden rounded-2xl border border-indigo-500/20 shadow-lg group transition-all duration-300"
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{
                background: "linear-gradient(to bottom right, rgba(49, 46, 129, 0.8), rgba(79, 70, 229, 0.2))",
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Category card content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg font-bold text-lg text-white">
                      {category.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-bold text-white text-lg">{category.name}</h3>
                  </div>
                </div>
                
                <div className="h-20 overflow-hidden mb-4">
                  <p className="text-indigo-100/80 text-sm line-clamp-3">{category.deskripsi}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-indigo-200/60">
                    {new Date(category.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onView(category)}
                      className="bg-indigo-500/20 hover:bg-indigo-500/40 backdrop-blur-sm text-indigo-300 hover:text-white rounded-xl p-2 transition-all duration-300"
                    >
                      <EyeOutlined />
                    </button>
                    <button
                      onClick={() => onEdit(category)}
                      className="bg-indigo-500/20 hover:bg-indigo-500/40 backdrop-blur-sm text-indigo-300 hover:text-white rounded-xl p-2 transition-all duration-300"
                    >
                      <EditOutlined />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Hover background effect */}
              <div 
                className={`absolute inset-0 bg-gradient-to-r from-purple-800/20 to-indigo-800/20 transition-opacity duration-300 ${hoverIndex === index ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradient 6s ease infinite',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-1.5 border border-indigo-500/30 shadow-lg">
          <div className="flex items-center">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-indigo-300 disabled:text-indigo-800 hover:bg-indigo-800/30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeftOutlined />
            </button>
            
            <div className="px-4 mx-2 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-700/30">
              {currentPage}
            </div>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-indigo-300 hover:bg-indigo-800/30 transition-colors"
            >
              <ArrowRightOutlined />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;