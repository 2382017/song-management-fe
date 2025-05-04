// SongList.tsx // Diubah
import { SongType } from "../pages/Songs"; // Diubah
import { EyeOutlined, EditOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

interface SongListProps { // Diubah
  songs: SongType[]; // Diubah
  onEdit: (song: SongType) => void; // Diubah
  onView: (song: SongType) => void; // Diubah
  onPageChange: (page: number) => void;
  currentPage: number;
}

// Diubah parameter props
const SongList = ({ songs, onEdit, onView, onPageChange, currentPage }: SongListProps) => { // Diubah
  return (
    <div>
      {songs.length === 0 ? ( // Diubah
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-gray-400 dark:text-gray-500 text-7xl mb-3">🎵</div> {/* Icon bisa disesuaikan */}
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Your collection is empty</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Add a song to start your collection</p> {/* Diubah */}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Diubah loop dan props */}
          {songs.map((song) => ( // Diubah
            <SongCard // Diubah
              key={song.id} // Diubah
              song={song} // Diubah
              onEdit={() => onEdit(song)} // Diubah
              onView={() => onView(song)} // Diubah
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {songs.length > 0 && ( // Diubah
        <div className="flex justify-center mt-10">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-3 text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
            >
              <LeftOutlined /> Prev
            </button>
            <div className="px-5 py-3 flex items-center justify-center font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              {currentPage}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              // Tambahkan logika disable jika ini halaman terakhir jika perlu
              className="px-4 py-3 text-gray-600 dark:text-gray-300 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
            >
              Next <RightOutlined />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface SongCardProps { // Diubah
  song: SongType; // Diubah
  onEdit: () => void;
  onView: () => void;
}

// Diubah Nama Komponen & parameter props
const SongCard = ({ song, onEdit, onView }: SongCardProps) => { // Diubah
  return (
    <div className="group bg-white dark:bg-slate-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        {song.image_url ? ( // Diubah
          <img
            src={song.image_url} // Diubah
            alt={song.title} // Diubah
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-gray-500 dark:text-gray-400">No Image</span>
          </div>
        )}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute bottom-0 left-0 w-full p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
          <button
            onClick={onView}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg flex items-center justify-center gap-1 text-sm"
          >
            <EyeOutlined /> View
          </button>
          <button
            onClick={onEdit}
            className="flex-1 bg-gray-800/80 hover:bg-gray-900 text-white py-1.5 rounded-lg flex items-center justify-center gap-1 text-sm"
          >
            <EditOutlined /> Edit
          </button>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-1">
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
            {song.category?.name || "Uncategorized"} {/* Diubah */}
          </span>
        </div>
        <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-1 line-clamp-1">{song.title}</h3> {/* Diubah */}
        <p className="text-gray-600 dark:text-gray-400 text-sm flex-1">Artist: {song.artist}</p> {/* Diubah */}

        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <button
            onClick={onView}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1"
          >
            <EyeOutlined /> Details
          </button>
          <button
            onClick={onEdit}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm flex items-center gap-1"
          >
            <EditOutlined /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongList; // Diubah