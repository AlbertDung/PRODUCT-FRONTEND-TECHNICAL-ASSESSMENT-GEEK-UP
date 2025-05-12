import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiEye, FiSearch, FiFilter, FiGrid, FiList, FiPlus } from 'react-icons/fi';
import { getAlbums, getUsers, getAvatarUrl } from '../services/api';
import type { Album, User } from '../types';
import Pagination from '../components/Pagination';

const DEFAULT_PAGE_SIZE = 12;

const AlbumList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  // Track screen size to adjust layout
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Update isMobile state when window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: albums, isLoading: isLoadingAlbums } = useQuery<Album[]>({
    queryKey: ['albums'],
    queryFn: getAlbums,
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const isLoading = isLoadingAlbums || isLoadingUsers;

  const filteredAlbums = albums?.filter(album =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = filteredAlbums ? Math.ceil(filteredAlbums.length / pageSize) : 0;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentAlbums = filteredAlbums?.slice(startIndex, endIndex) || [];

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
    // Scroll to top when changing pages
    window.scrollTo(0, 0);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setSearchParams({ page: '1' }); // Reset to first page when changing page size
  };

  const getUserById = (userId: number) => {
    return users?.find((user) => user.id === userId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-gray-900">Albums</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and organize your photo albums
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 mt-2 sm:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary inline-flex items-center gap-2 text-sm py-2 px-3 md:py-2 md:px-4"
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <FiFilter className="w-4 h-4" />
            <span className="hidden xs:inline">Filters</span>
          </button>
          <button
            onClick={() => navigate('/albums/new')}
            className="btn btn-primary inline-flex items-center gap-2 text-sm py-2 px-3 md:py-2 md:px-4"
          >
            <FiPlus className="w-4 h-4" />
            <span className="hidden xs:inline">New Album</span>
            <span className="xs:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-full py-2 text-sm md:text-base"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid'
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
          >
            <FiGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list'
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
          >
            <FiList className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div 
          id="filter-panel"
          className="bg-gray-50 rounded-xl p-3 md:p-4 border border-gray-200 animate-fadeIn"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div>
              <label htmlFor="user-filter" className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <select id="user-filter" className="input w-full text-sm">
                <option value="">All Users</option>
                {users?.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select id="sort-by" className="input w-full text-sm">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select id="status-filter" className="input w-full text-sm">
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {currentAlbums?.length === 0 && (
        <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
            <FiSearch className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No albums found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Albums Grid */}
      {viewMode === 'grid' && currentAlbums?.length > 0 && (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {currentAlbums?.map((album) => {
            const user = getUserById(album.userId);
            return (
              <div
                key={album.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full cursor-pointer group p-3 md:p-4"
                onClick={() => navigate(`/albums/${album.id}`)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary-50 rounded-lg text-base md:text-lg font-display font-bold text-primary-600/80 select-none border border-primary-100">
                    {album.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-0.5 truncate" title={album.title}>
                      {album.title}
                    </h3>
                    {user && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <img
                          src={getAvatarUrl(user.name)}
                          alt={user.name}
                          className="h-5 w-5 rounded-full ring-1 ring-white"
                        />
                        <span className="truncate max-w-[100px]" title={user.name}>{user.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/albums/${album.id}`); }}
                    className="btn btn-primary w-full flex items-center justify-center gap-1.5 py-1.5 text-sm group-hover:scale-[1.02] transition"
                    aria-label={`View album: ${album.title}`}
                  >
                    <FiEye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Albums List */}
      {viewMode === 'list' && currentAlbums?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Album</th>
                  <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentAlbums?.map((album) => {
                  const user = getUserById(album.userId);
                  return (
                    <tr 
                      key={album.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => isMobile ? navigate(`/albums/${album.id}`) : null}
                    >
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-base md:text-lg font-display font-bold text-primary-600/20">{album.id}</span>
                          </div>
                          <div className="ml-3">
                            <div className="text-xs md:text-sm font-medium text-gray-900 line-clamp-1">{album.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        {user && (
                          <div className="flex items-center">
                            <img
                              src={getAvatarUrl(user.name)}
                              alt={user.name}
                              className="h-6 w-6 md:h-8 md:w-8 rounded-full ring-1 ring-white"
                            />
                            <span className="ml-2 text-xs md:text-sm text-gray-900 hidden sm:inline">{user.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right text-xs md:text-sm font-medium">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/albums/${album.id}`); }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredAlbums && filteredAlbums.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={filteredAlbums.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

export default AlbumList;