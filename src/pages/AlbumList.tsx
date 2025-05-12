import { useState } from 'react';
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
  const currentAlbums = filteredAlbums?.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Albums</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and organize your photo albums
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <FiFilter className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={() => navigate('/albums/new')}
            className="btn btn-primary inline-flex items-center gap-2 "
          >
            <FiPlus className="w-4 h-4" />
            New Album
          </button>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 w-full"
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
          >
            <FiList className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <select className="input w-full">
                <option value="">All Users</option>
                {users?.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select className="input w-full">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select className="input w-full">
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Albums Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 md:gap-6">
          {currentAlbums?.map((album) => {
            const user = getUserById(album.userId);
            return (
              <div
                key={album.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-full min-h-[140px] cursor-pointer group px-4 pt-4 pb-3"
                onClick={() => window.innerWidth < 640 && navigate(`/albums/${album.id}`)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-50 rounded-lg text-lg font-display font-bold text-primary-600/80 select-none border border-primary-100">
                    {album.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-0.5 truncate" title={album.title}>{album.title}</h3>
                    {user && (
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                        <img
                          src={getAvatarUrl(user.name)}
                          alt={user.name}
                          className="h-5 w-5 sm:h-6 sm:w-6 rounded-full ring-2 ring-white"
                        />
                        <span className="hidden xs:inline truncate max-w-[80px]" title={user.name}>{user.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Desktop: show View button */}
                <div className="hidden sm:block mt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/albums/${album.id}`); }}
                    className="btn btn-primary w-full flex items-center justify-center gap-2 group-hover:scale-[1.03] group-hover:shadow-md transition"
                  >
                    <FiEye className="w-4 h-4" />
                    <span className="hidden xs:inline">View Details</span>
                    <span className="xs:hidden">View</span>
                  </button>
                </div>
                {/* Mobile: show View button only */}
                <div className="block sm:hidden mt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/albums/${album.id}`); }}
                    className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm group-hover:scale-[1.03] group-hover:shadow-md transition"
                  >
                    <FiEye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Album</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentAlbums?.map((album) => {
                const user = getUserById(album.userId);
                return (
                  <tr key={album.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-display font-bold text-primary-600/20">{album.id}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">{album.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {user && (
                        <div className="flex items-center">
                          <img
                            src={getAvatarUrl(user.name)}
                            alt={user.name}
                            className="h-8 w-8 rounded-full ring-2 ring-white"
                          />
                          <span className="ml-2 text-sm text-gray-900 hidden xs:inline">{user.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/albums/${album.id}`)}
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