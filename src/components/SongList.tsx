// SongList.tsx
import { SongType } from "../pages/Songs"; // Adjust path if needed
import {
  EyeOutlined,
  EditOutlined,
  LeftOutlined,
  RightOutlined,
  PlayCircleOutlined,
  // MusicNote removed as it is not exported and unused
} from "@ant-design/icons"; // Or other icon library

interface SongListProps {
  songs: SongType[];
  onEdit: (song: SongType) => void;
  onView: (song: SongType) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  viewMode: 'grid' | 'list'; // Added viewMode prop
}

const SongList = ({ songs, onEdit, onView, onPageChange, currentPage, viewMode }: SongListProps) => {
  return (
    <div className="transition-all duration-500">
      {songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-purple-900/30 rounded-2xl border border-purple-800/50 text-center shadow-xl">
           {/* Use a relevant icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p className="text-xl font-semibold text-purple-200 mb-2">No tracks found</p>
          <p className="text-purple-300/80">Try adding a new song or adjusting the filters.</p>
        </div>
      ) : (
        // Conditional rendering based on viewMode
        <div className={viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" // Adjust grid columns as needed
            : "space-y-4" // Classes for list view
        }>
          {songs.map((song) =>
            viewMode === 'grid' ? (
              <SongCardGrid key={song.id} song={song} onEdit={onEdit} onView={onView} />
            ) : (
              <SongCardList key={song.id} song={song} onEdit={onEdit} onView={onView} />
            )
          )}
        </div>
      )}

      {/* Pagination - Styled for the new theme */}
      {songs.length > 0 && (
        <div className="flex justify-center mt-12">
          <nav className="inline-flex rounded-lg shadow-md overflow-hidden bg-purple-800/60 border border-purple-700/50">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 text-sm font-medium text-purple-300 hover:bg-purple-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 border-r border-purple-700/50"
            >
              <LeftOutlined /> Prev
            </button>
            <div className="px-5 py-2 flex items-center justify-center text-sm font-semibold bg-purple-900/50 text-pink-400">
              {currentPage}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
               // Add disable logic for last page if total count is available
              className="px-4 py-2 text-sm font-medium text-purple-300 hover:bg-purple-700/50 transition-colors flex items-center gap-1 border-l border-purple-700/50"
            >
              Next <RightOutlined />
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};


// New Grid Card Component
const SongCardGrid = ({ song, onEdit, onView }: { song: SongType, onEdit: (song: SongType) => void, onView: (song: SongType) => void }) => {
  return (
    <div className="group relative bg-gradient-to-br from-gray-800/70 to-gray-900/80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-600/20 transition-all duration-300 border border-gray-700/50 backdrop-blur-sm">
      <div className="relative aspect-square overflow-hidden">
        {/* Image */}
        {song.image_url ? (
          <img
            src={song.image_url}
            alt={song.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Track'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-800 to-indigo-900">
            <PlayCircleOutlined className="text-5xl text-white/30" />
          </div>
        )}
         {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {/* Play button overlay on hover */}
        <button onClick={() => onView(song)} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlayCircleOutlined className="text-5xl text-white/80 hover:text-white transform transition hover:scale-110" />
        </button>
      </div>
       {/* Content Area */}
      <div className="p-4">
        <h3 className="font-semibold text-white truncate text-lg mb-0.5 group-hover:text-pink-400 transition-colors">{song.title}</h3>
        <p className="text-sm text-gray-400 truncate mb-2">{song.artist}</p>
        <span className="inline-block bg-purple-800/70 text-purple-200 text-xs font-medium px-2 py-0.5 rounded">
          {song.category?.name || "Unknown"}
        </span>
      </div>
      {/* Hidden Edit/View buttons revealed on demand or always visible if preferred */}
      <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <button onClick={() => onView(song)} className="bg-black/50 hover:bg-purple-600 text-white p-1.5 rounded-full backdrop-blur-sm"><EyeOutlined /></button>
         <button onClick={() => onEdit(song)} className="bg-black/50 hover:bg-pink-600 text-white p-1.5 rounded-full backdrop-blur-sm"><EditOutlined /></button>
      </div>
    </div>
  );
};


// New List Card Component
const SongCardList = ({ song, onEdit, onView }: { song: SongType, onEdit: (song: SongType) => void, onView: (song: SongType) => void }) => {
  return (
    <div className="group flex items-center gap-4 bg-gradient-to-r from-gray-800/60 to-gray-900/70 p-3 rounded-lg shadow-md hover:bg-gray-800/80 transition-all duration-200 border border-gray-700/50 backdrop-blur-sm">
       {/* Image Thumbnail */}
        {song.image_url ? (
          <img
            src={song.image_url}
            alt={song.title}
            className="w-14 h-14 object-cover rounded flex-shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60x60?text=...'; }}
          />
        ) : (
          <div className="w-14 h-14 flex items-center justify-center bg-purple-800 rounded flex-shrink-0">
             <PlayCircleOutlined className="text-2xl text-white/40" />
          </div>
        )}
        {/* Title & Artist */}
        <div className="flex-grow overflow-hidden">
             <h3 className="font-semibold text-white truncate group-hover:text-pink-400 transition-colors">{song.title}</h3>
             <p className="text-sm text-gray-400 truncate">{song.artist}</p>
        </div>
         {/* Category */}
        <span className="hidden md:inline-block bg-purple-800/70 text-purple-200 text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0">
          {song.category?.name || "Unknown"}
        </span>
         {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
             <button onClick={() => onView(song)} className="text-purple-300 hover:text-pink-400 p-1 transition-colors"><EyeOutlined /></button>
             <button onClick={() => onEdit(song)} className="text-purple-300 hover:text-pink-400 p-1 transition-colors"><EditOutlined /></button>
        </div>
    </div>
  );
};


export default SongList;