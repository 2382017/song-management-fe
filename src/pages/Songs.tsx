import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import SongList from "../components/SongList"; // Pastikan path ini benar
import SongForm from "../components/SongForm"; // Pastikan path ini benar
import SongDetail from "./SongDetail";         // Pastikan path ini benar
import { PlusCircleOutlined, AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons"; // Updated icons

// Type definitions remain the same - keeping the logic
export type SongType = {
  id: number;
  title: string;
  artist: string;
  category_id: number;
  category: {
    id: number;
    name: string;
  };
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type CategoryType = {
  id: number;
  name: string;
};

// API functions - same logic
const fetchSongList = async (token: string | null, page = 1, limit = 12) => { // Increased limit for grid potentially
  return await axios.get<SongType[]>(`/api/songs?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const fetchCategories = async (token: string | null) => {
  return await axios.get<CategoryType[]>("/api/category", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const Songs = () => {
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSong, setSelectedSong] = useState<SongType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // New state for view toggle

  // Same query logic
  const { data: songData, refetch: refetchSongs, isLoading } = useQuery({ // Added isLoading
    queryKey: ["songList", currentPage, activeCategory], // Added activeCategory to key
    // Updated queryFn to potentially filter on backend later, for now frontend filter
    queryFn: () => fetchSongList(getToken(), currentPage)
  });

  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(getToken())
  });

  // Handler functions - same logic
  const handleAddNewClick = () => {
    setSelectedSong(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditClick = (song: SongType) => {
    setSelectedSong(song);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleViewClick = (song: SongType) => {
    setSelectedSong(song);
    setIsFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleCloseDetail = () => {
    setSelectedSong(null);
  };

  const handleFormSubmit = () => {
    refetchSongs();
    setIsFormOpen(false);
  };

  const handleDeleteSuccess = () => {
    refetchSongs();
    setSelectedSong(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    setActiveCategory(categoryId);
    setCurrentPage(1); // Reset page when category changes
    // Note: For backend filtering, you'd pass categoryId to fetchSongList and update queryKey
  };

  // Filter songs client-side based on activeCategory
  const filteredSongs = songData?.data
    ? activeCategory === null
      ? songData.data
      : songData.data.filter((song) => song.category_id === activeCategory)
    : [];

  return (
    // New UI: Dark, vibrant, music-focused theme
    <div className="min-h-screen bg-gradient-to-b from-[#100a1f] to-[#1f1438] text-gray-200 font-sans">
       {/* Floating background shapes */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 -right-40 w-80 h-80 bg-pink-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-indigo-500/20 rounded-full filter blur-3xl opacity-40 animate-pulse animation-delay-4000"></div>
       </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-12 border-b border-purple-800/50 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-1 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              Melody Vault
            </h1>
            <p className="text-purple-300 text-md">Your personal sound library</p>
          </div>
          <button
            onClick={handleAddNewClick}
            className="mt-4 sm:mt-0 flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2 px-5 rounded-lg shadow-lg hover:shadow-pink-500/30 transition-all duration-300 transform hover:scale-105"
          >
            <PlusCircleOutlined /> Add Track
          </button>
        </header>

        {/* Filter and View Controls */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Category Filter */}
          {categoryData?.data && categoryData.data.length > 0 && (
            <nav className="overflow-x-auto pb-2 flex-grow">
              <ul className="flex space-x-2">
                <li>
                  <button
                    onClick={() => handleCategoryFilter(null)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      activeCategory === null
                        ? "bg-pink-500 text-white shadow-md"
                        : "bg-purple-800/40 text-purple-200 hover:bg-purple-700/60"
                    }`}
                  >
                    All Tracks
                  </button>
                </li>
                {categoryData.data.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryFilter(category.id)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                        activeCategory === category.id
                          ? "bg-pink-500 text-white shadow-md"
                          : "bg-purple-800/40 text-purple-200 hover:bg-purple-700/60"
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
           {/* View Mode Toggle */}
           <div className="flex space-x-1 bg-purple-800/40 p-1 rounded-lg flex-shrink-0">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'text-purple-300 hover:text-white'}`}><AppstoreOutlined /></button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'text-purple-300 hover:text-white'}`}><UnorderedListOutlined /></button>
           </div>
        </div>


        {/* Main Content Area */}
        <main>
            {isLoading ? (
                 <div className="text-center py-20">
                     <svg className="animate-spin h-8 w-8 text-purple-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     <p className="mt-2 text-purple-300">Loading tracks...</p>
                 </div>
            ) : (
                 <SongList
                    songs={filteredSongs}
                    onEdit={handleEditClick}
                    onView={handleViewClick}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                    viewMode={viewMode} // Pass viewMode
                 />
            )}
        </main>
      </div>

      {/* Modals - logic remains, styling handled internally */}
      {isFormOpen && (
        <SongForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          song={isEditMode ? selectedSong : null}
          isEditMode={isEditMode}
          categories={categoryData?.data || []}
        />
      )}

      {selectedSong && !isFormOpen && (
        <SongDetail
          song={selectedSong}
          onClose={handleCloseDetail}
          onEdit={() => handleEditClick(selectedSong)}
          onDelete={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Songs;
