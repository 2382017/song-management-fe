import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  CloseOutlined,
  SaveOutlined,
  PlaySquareOutlined, // Diubah dari VideoCameraOutlined
  TagOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

// Nama Type dan properti diubah
type UlasanType = {
  id: number;
  ulasan: string; // Diubah
  song_id: number; // Diubah
  created_at: string;
  updated_at: string;
  song: { // Diubah
    id: number;
    title: string;
    cover_image?: string;
    category: { // Diubah
      id: number;
      name: string;
    };
  };
};

// Nama Type diubah
type SongType = {
  id: number;
  title: string;
};

// Nama Type dan properti diubah
type CreateUlasanDTO = {
  songId: number; // Diubah
  ulasan: string; // Diubah
};

// Nama fungsi, endpoint, dan return type diubah
const fetchUlasans = async (token: string | null) => {
  return await axios.get<UlasanType[]>("/api/ulasan", { // Diubah endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Nama fungsi, parameter, endpoint, dan return type diubah
const fetchSongUlasans = async (songId: number, token: string | null) => {
  return await axios.get<UlasanType[]>(`/api/ulasan/song/${songId}`, { // Diubah endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Nama fungsi, endpoint, dan return type diubah
const fetchSongs = async (token: string | null) => {
  return await axios.get<SongType[]>("/api/songs", { // Diubah endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Nama fungsi, parameter type, dan endpoint diubah
const createUlasan = async (ulasanData: CreateUlasanDTO, token: string | null) => {
  return await axios.post("/api/ulasan", ulasanData, { // Diubah endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Nama fungsi, parameter type, dan endpoint diubah
const updateUlasan = async (
  id: number,
  ulasanData: CreateUlasanDTO,
  token: string | null
) => {
  return await axios.put(`/api/ulasan/${id}`, ulasanData, { // Diubah endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Nama fungsi dan endpoint diubah
const deleteUlasan = async (id: number, token: string | null) => {
  return await axios.delete(`/api/ulasan/${id}`, { // Diubah endpoint
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Nama Komponen dan props diubah
const UlasanCard = ({
  ulasan, // Diubah
  onEdit,
  onDelete
}: {
  ulasan: UlasanType; // Diubah
  onEdit: (ulasan: UlasanType) => void; // Diubah
  onDelete: (id: number) => void;
}) => {
  return (
    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
      <div className="flex items-start mb-3"> {/* Mengubah items-center ke items-start agar judul & kategori tidak center jika gambar tinggi */}
        <div className="flex-grow">
          {/* Akses data diubah */}
          <h2 className="text-lg font-bold text-gray-800">{ulasan.song.title}</h2>
          <div className="flex items-center text-xs text-gray-600 mb-1">
            <TagOutlined className="mr-1" />
            {/* Akses data diubah */}
            <span>{ulasan.song.category?.name || "Uncategorized"}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <ClockCircleOutlined className="mr-1" />
            {/* Akses data diubah */}
            <span>{new Date(ulasan.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
        {/* Akses data diubah */}
        {ulasan.song.cover_image && (
          <img
            src={ulasan.song.cover_image} // Diubah
            alt={ulasan.song.title} // Diubah
            className="w-16 h-20 object-cover rounded-sm ml-3 flex-shrink-0" // Tambah flex-shrink-0
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/150x200?text=No+Cover"; // Diubah placeholder text
            }}
          />
        )}
      </div>
      {/* Akses data diubah */}
      <p className="text-gray-700 mb-2 whitespace-pre-wrap">{ulasan.ulasan}</p> {/* Tambah whitespace-pre-wrap */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onEdit(ulasan)} // Diubah
          className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
        >
          <EditOutlined className="mr-1" /> Edit
        </button>
        <button
          onClick={() => onDelete(ulasan.id)} // Diubah
          className="text-red-500 hover:text-red-700 flex items-center text-sm"
        >
          <DeleteOutlined className="mr-1" /> Delete
        </button>
      </div>
    </div>
  );
};

// Nama Komponen dan props diubah
const UlasanForm = ({
  ulasan, // Diubah
  onSubmit,
  onCancel
}: {
  ulasan: Partial<UlasanType> | null; // Diubah
  onSubmit: (data: CreateUlasanDTO) => void;
  onCancel: () => void;
}) => {
  const { getToken } = useAuth();
  // State type dan initial value diubah
  const [formData, setFormData] = useState<CreateUlasanDTO>({
    songId: ulasan?.song_id || 0, // Diubah
    ulasan: ulasan?.ulasan || "" // Diubah
  });

  // Query key dan fetch function diubah
  const { data: songsData } = useQuery({
    queryKey: ["songsList"], // Diubah
    queryFn: () => fetchSongs(getToken()) // Diubah
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Check name diubah
      [name]: name === "songId" ? parseInt(value) : value // Diubah
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi dasar
    if (!formData.songId) {
        alert("Please select a song.");
        return;
    }
    if (!formData.ulasan.trim()) {
        alert("Ulasan cannot be empty.");
        return;
    }
    onSubmit(formData);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-lg">
      {/* Judul diubah */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">{ulasan ? "Edit Ulasan" : "Add New Ulasan"}</h2>
         <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <CloseOutlined />
         </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          {/* Label diubah */}
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="songId">
            <PlaySquareOutlined className="mr-1" /> Song
          </label>
          {/* Select attributes dan options diubah */}
          <select
            id="songId" // Diubah
            name="songId" // Diubah
            value={formData.songId || ""} // Diubah
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white" // Tambah bg-white
            required
          >
            <option value="">Select a song</option> {/* Diubah */}
            {/* Map data diubah */}
            {songsData?.data.map((song) => (
              <option key={song.id} value={song.id}>
                {song.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          {/* Label diubah */}
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ulasan">
            Ulasan
          </label>
          {/* Textarea attributes diubah */}
          <textarea
            id="ulasan" // Diubah
            name="ulasan" // Diubah
            value={formData.ulasan} // Diubah
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
            placeholder="Write your ulasan here..." // Diubah
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="border border-gray-300 rounded px-3 py-1.5 text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white rounded px-3 py-1.5 flex items-center text-sm hover:bg-blue-600">
            <SaveOutlined className="mr-1" /> {ulasan ? "Update" : "Submit"} {/* Diubah */}
          </button>
        </div>
      </form>
    </div>
  );
};

// Props diubah
const FilterPanel = ({
  selectedSongId, // Diubah
  setSelectedSongId // Diubah
}: {
  selectedSongId: number | null; // Diubah
  setSelectedSongId: (id: number | null) => void; // Diubah
}) => {
  const { getToken } = useAuth();
  // Query key dan fetch function diubah
  const { data: songsData } = useQuery({
    queryKey: ["songsList"], // Diubah
    queryFn: () => fetchSongs(getToken()) // Diubah
  });

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-lg">
      {/* Judul diubah */}
      <h2 className="text-sm font-medium text-gray-600 mb-2">
        <FilterOutlined className="mr-1" /> Filter by Song
      </h2>
      {/* Select value dan onChange diubah */}
      <select
        value={selectedSongId || ""} // Diubah
        onChange={(e) =>
          setSelectedSongId(e.target.value ? parseInt(e.target.value) : null) // Diubah
        }
        className="w-full px-3 py-2 border border-gray-300 rounded bg-white" // Tambah bg-white
      >
        <option value="">All Ulasans</option> {/* Diubah */}
        {/* Map data diubah */}
        {songsData?.data.map((song) => (
          <option key={song.id} value={song.id}>
            {song.title}
          </option>
        ))}
      </select>
      {/* Condition dan onClick diubah */}
      {selectedSongId && (
        <button
          onClick={() => setSelectedSongId(null)} // Diubah
          className="mt-2 text-xs text-gray-600 border border-gray-300 rounded px-2 py-1 hover:bg-gray-100"
        >
          <CloseOutlined className="mr-1" /> Clear Filter
        </button>
      )}
    </div>
  );
};

const EmptyState = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 text-center shadow-lg">
      {/* Icon bisa disesuaikan jika perlu */}
      <PlaySquareOutlined className="text-blue-500 text-4xl mb-3" />
      {/* Teks diubah */}
      <h3 className="text-lg font-medium text-gray-700 mb-2">No ulasans found</h3>
      <p className="text-gray-500 mb-4">You haven't added any ulasans yet.</p>
      <button
        onClick={onAdd}
        className="bg-blue-500 text-white rounded px-3 py-1.5 flex items-center mx-auto text-sm hover:bg-blue-600"
      >
        {/* Teks diubah */}
        <PlusOutlined className="mr-1" /> Add Your First Ulasan
      </button>
    </div>
  );
};

// Nama Komponen diubah
const Ulasan = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  // State diubah
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  // State diubah
  const [editingUlasan, setEditingUlasan] = useState<UlasanType | null>(null);

  // Query key, fetch function, enabled condition, data variable diubah
  const { data: allUlasansData, isLoading: isLoadingAllUlasans } = useQuery({
    queryKey: ["ulasansList"], // Diubah
    queryFn: () => fetchUlasans(getToken()), // Diubah
    enabled: !selectedSongId // Diubah
  });

  // Query key, fetch function, enabled condition, data variable diubah
  const { data: songUlasansData, isLoading: isLoadingSongUlasans } = useQuery({
    queryKey: ["songUlasans", selectedSongId], // Diubah
    queryFn: () => fetchSongUlasans(selectedSongId as number, getToken()), // Diubah
    enabled: !!selectedSongId // Diubah
  });

  // Mutation function, parameter type, onSuccess logic diubah
  const createMutation = useMutation({
    mutationFn: (newUlasan: CreateUlasanDTO) => // Diubah
      createUlasan(newUlasan, getToken()), // Diubah
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ulasansList"] }); // Diubah
      if (selectedSongId) { // Diubah
        queryClient.invalidateQueries({
          queryKey: ["songUlasans", selectedSongId] // Diubah
        });
      }
      setShowForm(false);
    }
    // onError bisa ditambahkan untuk menampilkan pesan error
  });

  // Mutation function, parameter type, onSuccess logic diubah
  const updateMutation = useMutation({
    mutationFn: ({ id, ulasan }: { id: number; ulasan: CreateUlasanDTO }) => // Diubah
      updateUlasan(id, ulasan, getToken()), // Diubah
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ulasansList"] }); // Diubah
      if (selectedSongId) { // Diubah
        queryClient.invalidateQueries({
          queryKey: ["songUlasans", selectedSongId] // Diubah
        });
      }
      setShowForm(false);
      setEditingUlasan(null); // Diubah
    }
     // onError bisa ditambahkan
  });

  // Mutation function, onSuccess logic diubah
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUlasan(id, getToken()), // Diubah
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ulasansList"] }); // Diubah
      if (selectedSongId) { // Diubah
        queryClient.invalidateQueries({
          queryKey: ["songUlasans", selectedSongId] // Diubah
        });
      }
    }
     // onError bisa ditambahkan
  });

  const handleAddClick = () => {
    setEditingUlasan(null); // Diubah
    setShowForm(true);
  };

  // Parameter type diubah
  const handleEditClick = (ulasan: UlasanType) => {
    setEditingUlasan(ulasan); // Diubah
    setShowForm(true);
  };

  const handleDeleteClick = (id: number) => {
    // Konfirmasi diubah
    if (window.confirm("Are you sure you want to delete this ulasan?")) {
      deleteMutation.mutate(id);
    }
  };

  // Parameter type dan logic diubah
  const handleFormSubmit = (data: CreateUlasanDTO) => {
    if (editingUlasan) { // Diubah
      updateMutation.mutate({ id: editingUlasan.id, ulasan: data }); // Diubah
    } else {
      createMutation.mutate(data);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUlasan(null); // Diubah
  };

  // Variabel data dan loading diubah
  const ulasans = selectedSongId ? songUlasansData?.data : allUlasansData?.data; // Diubah
  const isLoading = selectedSongId ? isLoadingSongUlasans : isLoadingAllUlasans; // Diubah

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        {/* Judul diubah */}
        <h1 className="text-2xl font-bold text-gray-800">My Song Ulasans</h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="bg-blue-500 text-white rounded px-4 py-2 flex items-center text-sm hover:bg-blue-600"
          >
            {/* Teks diubah */}
            <PlusOutlined className="mr-1" /> Add Ulasan
          </button>
        )}
      </div>

      {showForm ? (
        // Komponen Form dan props diubah
        <UlasanForm
          ulasan={editingUlasan || null} // Diubah
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <>
          {/* Komponen Filter dan props diubah */}
          <FilterPanel
            selectedSongId={selectedSongId} // Diubah
            setSelectedSongId={setSelectedSongId} // Diubah
          />

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin inline-block size-6 border-2 border-current border-t-transparent rounded-full mb-2"></div>
              {/* Teks diubah */}
              <p>Loading ulasans...</p>
            </div>
            // Cek data dan panjang array diubah
          ) : ulasans && ulasans.length > 0 ? (
            <div>
              {/* Map variabel dan Komponen Card diubah */}
              {ulasans.map((ulasan) => (
                <UlasanCard // Diubah
                  key={ulasan.id} // Diubah
                  ulasan={ulasan} // Diubah
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState onAdd={handleAddClick} />
          )}
        </>
      )}
    </div>
  );
};

export default Ulasan; // Diubah