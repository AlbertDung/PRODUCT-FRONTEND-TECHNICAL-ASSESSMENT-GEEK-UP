import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiMail, FiPhone, FiExternalLink, FiArrowLeft, FiImage, FiUser, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { getUser, getUserAlbums, getAvatarUrl } from '../services/api';
import type { User, Album } from '../types';
import React from 'react';

const ITEMS_PER_PAGE = 8;

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = Number(id);
  const [page, setPage] = React.useState(1);

  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });

  const { data: albums, isLoading: isLoadingAlbums } = useQuery<Album[]>({
    queryKey: ['user-albums', userId],
    queryFn: () => getUserAlbums(userId),
    enabled: !!userId,
  });

  const isLoading = isLoadingUser || isLoadingAlbums;

  const totalAlbums = albums?.length || 0;
  const totalPages = Math.ceil(totalAlbums / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentAlbums = albums?.slice(startIndex, endIndex) || [];

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600"></div>
      </div>
    );
  }

  if (!user || !albums) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <FiUser className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">User not found</h2>
        <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/users')}
          className="btn btn-primary inline-flex items-center"
        >
          <FiArrowLeft className="mr-2" />
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in p-2 sm:p-4">
      <button
        onClick={() => navigate('/users')}
        className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200 mb-2"
      >
        <FiArrowLeft className="mr-2" />
        Back to Users
      </button>

      <div className="glass-card rounded-2xl p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
          <div className="relative self-center sm:self-auto">
            <img
              src={getAvatarUrl(user.name, 96)}
              alt={user.name}
              className="h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white shadow-lg"
            />
          </div>
          <div className="flex-1 w-full">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-2 sm:mb-4">{user.name}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <a
                href={`mailto:${user.email}`}
                className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200 break-all"
              >
                <FiMail className="mr-2 h-5 w-5" />
                {user.email}
              </a>
              <a
                href={`tel:${user.phone}`}
                className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
              >
                <FiPhone className="mr-2 h-5 w-5" />
                {user.phone}
              </a>
              <a
                href={`https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200 col-span-1 sm:col-span-2 break-all"
              >
                <FiExternalLink className="mr-2 h-5 w-5" />
                {user.website}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900">Albums</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-600">
            <FiImage className="mr-2 h-4 w-4" />
            {albums.length} Albums
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {currentAlbums.map((album) => (
            <div
              key={album.id}
              className="card group hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-full min-h-[160px]"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 text-center min-h-[48px] flex items-center justify-center">
                {album.title}
              </h3>
              <div className="flex flex-col items-center mb-4">
                <div className="aspect-w-16 aspect-h-9 w-full max-w-[180px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-2 h-[80px]">
                  <span className="text-4xl font-display font-bold text-primary-600/20 select-none flex items-center justify-center w-full h-full">
                    {album.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/albums/${album.id}`)}
                className="btn btn-primary w-full mt-auto flex items-center justify-center gap-2 text-base"
              >
                <FiImage />
                <span className="hidden xs:inline">View Album</span>
                <span className="xs:hidden">View</span>
              </button>
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8 flex-wrap">
            <button
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              aria-label="First page"
            >
              <FiChevronsLeft className="mr-1" /> First
            </button>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              aria-label="Previous page"
            >
              <FiChevronLeft className="mr-1" /> Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pageNum === page
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              aria-label="Next page"
            >
              Next <FiChevronRight className="ml-1" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={page === totalPages}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              aria-label="Last page"
            >
              Last <FiChevronsRight className="ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail; 