import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import SongList from "../components/SongList"; // Diubah
import SongForm from "../components/SongForm"; // Diubah
import SongDetail from "./SongDetail"; // Diubah
import { PlusOutlined } from "@ant-design/icons";

// Diubah Tipe
export type SongType = {
  id: number;
  title: string;
  artist: string; // Diubah
  category_id: number; // Diubah
  category: { // Diubah
    id: number;
    name: string;
  };
  image_url: string;
  created_at: string;
  updated_at: string;
};

// Diubah Tipe
export type CategoryType = {
  id: number;
  name: string;
};

// Diubah Nama Fungsi & Endpoint
const fetchSongList = async (token: string | null, page = 1, limit = 10) => {
  return await axios.get<SongType[]>(`/api/songs?page=${page}&limit=${limit}`, { // Diubah
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Diubah Nama Fungsi & Endpoint
const fetchCategories = async (token: string | null) => {
  return await axios.get<CategoryType[]>("/api/category", { // Diubah
    headers: { Authorization: `Bearer ${token}` }
  });
};

const Songs = () => { // Diubah
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSong, setSelectedSong] = useState<SongType | null>(null); // Diubah
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Diubah queryKey, queryFn, variabel data, refetch
  const { data: songData, refetch: refetchSongs } = useQuery({
    queryKey: ["songList", currentPage], // Diubah
    queryFn: () => fetchSongList(getToken(), currentPage) // Diubah
  });

  // Diubah queryKey, queryFn, variabel data
  const { data: categoryData } = useQuery({
    queryKey: ["categories"], // Diubah
    queryFn: () => fetchCategories(getToken()) // Diubah
  });

  const handleAddNewClick = () => {
    setSelectedSong(null); // Diubah
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  // Diubah parameter fungsi
  const handleEditClick = (song: SongType) => { // Diubah
    setSelectedSong(song); // Diubah
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  // Diubah parameter fungsi
  const handleViewClick = (song: SongType) => { // Diubah
    setSelectedSong(song); // Diubah
    setIsFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleCloseDetail = () => {
    setSelectedSong(null); // Diubah
  };

  const handleFormSubmit = () => {
    refetchSongs(); // Diubah
    setIsFormOpen(false);
  };

  const handleDeleteSuccess = () => {
    refetchSongs(); // Diubah
    setSelectedSong(null); // Diubah
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-white mb-2">Song Collection</h1> {/* Diubah */}
            <p className="text-blue-100 text-lg">Manage your favorite songs in one place</p> {/* Diubah */}
            <button
              onClick={handleAddNewClick}
              className="absolute top-6 right-6 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-md transition-all duration-200"
            >
              <PlusOutlined /> Add New Song {/* Diubah */}
            </button>
          </div>
        </div>

        <div className="mb-10">
          {songData && ( // Diubah
            <SongList // Diubah
              songs={songData.data} // Diubah
              onEdit={handleEditClick}
              onView={handleViewClick}
              onPageChange={handlePageChange}
              currentPage={currentPage}
            />
          )}
        </div>

        {isFormOpen && (
          <SongForm // Diubah
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
            song={isEditMode ? selectedSong : null} // Diubah
            isEditMode={isEditMode}
            categories={categoryData?.data || []} // Diubah
          />
        )}

        {selectedSong && !isFormOpen && ( // Diubah
          <SongDetail // Diubah
            song={selectedSong} // Diubah
            onClose={handleCloseDetail}
            onEdit={() => handleEditClick(selectedSong)} // Diubah
            onDelete={handleDeleteSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Songs; // Diubah