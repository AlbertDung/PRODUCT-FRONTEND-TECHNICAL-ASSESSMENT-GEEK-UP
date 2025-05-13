import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FiArrowLeft, FiImage, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiEdit2, FiTrash2, FiDownload, FiShare2, FiMoreVertical } from 'react-icons/fi';
import { getAlbum, getAlbumPhotos, getUser, getAvatarUrl } from '../services/api';
import type { Album, Photo, User } from '../types';
import PhotoViewerModal from '../components/PhotoViewerModal';

const PHOTOS_PER_PAGE = 12;

const AlbumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const albumId = Number(id);
  const [currentPhotoPage, setCurrentPhotoPage] = React.useState<number>(1);
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [viewerIndex, setViewerIndex] = React.useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [, setIsTablet] = useState(window.innerWidth < 768);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: album, isLoading: isLoadingAlbum } = useQuery<Album>({
    queryKey: ['album', albumId],
    queryFn: () => getAlbum(albumId),
    enabled: !!albumId,
  });

  const { data: photos, isLoading: isLoadingPhotos } = useQuery<Photo[]>({
    queryKey: ['album-photos', albumId],
    queryFn: () => getAlbumPhotos(albumId),
    enabled: !!albumId,
  });

  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['user', album?.userId],
    queryFn: () => getUser(album!.userId),
    enabled: !!album?.userId,
  });

  const isLoading = isLoadingAlbum || isLoadingPhotos || isLoadingUser;

  const totalPhotos = photos?.length || 0;
  const totalPhotoPages = Math.ceil(totalPhotos / PHOTOS_PER_PAGE);
  const startPhotoIdx = (currentPhotoPage - 1) * PHOTOS_PER_PAGE;
  const endPhotoIdx = startPhotoIdx + PHOTOS_PER_PAGE;
  const currentPhotos = photos?.slice(startPhotoIdx, endPhotoIdx) || [];

  const handlePhotoClick = (idx: number) => {
    setViewerOpen(true);
    setViewerIndex(startPhotoIdx + idx);
  };

  // Navigate to new page and scroll to top
  const handlePageChange = (newPage: number) => {
    setCurrentPhotoPage(newPage);
    window.scrollTo({
      top: document.getElementById('photos-section')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600"></div>
      </div>
    );
  }

  if (!album || !user || !photos) {
    return (
      <div className="text-center py-8 md:py-12 px-4">
        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-100 mb-3 md:mb-4">
          <FiImage className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
        </div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 mb-2">Album not found</h2>
        <p className="text-gray-600 mb-4 md:mb-6">The album you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/albums')}
          className="btn btn-primary inline-flex items-center py-2 px-4 text-sm"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Albums
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => navigate('/albums')}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
            aria-label="Back to albums"
          >
            <FiArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
            <span className="ml-1 md:ml-2 text-sm md:text-base">Back</span>
          </button>
          <div>
            <h1 className="text-lg md:text-2xl font-display font-bold text-gray-900 line-clamp-1" title={album.title}>
              {album.title}
            </h1>
            <p className="mt-0.5 text-xs md:text-sm text-gray-500">
              Created by {user.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 mt-2 sm:mt-0">
          <button className="btn btn-secondary inline-flex items-center gap-1 md:gap-2 text-xs md:text-sm py-1.5 px-2.5 md:py-2 md:px-4">
            <FiEdit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden xs:inline">Edit</span> <span>Album</span>
          </button>
          <button className="btn btn-danger inline-flex items-center gap-1 md:gap-2 text-xs md:text-sm py-1.5 px-2.5 md:py-2 md:px-4">
            <FiTrash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden xs:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Album Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">Album Information</h2>
              <button className="text-gray-400 hover:text-gray-500" aria-label="More options">
                <FiMoreVertical className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-500">Title</label>
                <p className="mt-1 text-xs md:text-sm text-gray-900">{album.title}</p>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-xs md:text-sm text-gray-900">
                  A collection of photos showcasing various moments and memories.
                </p>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-500">Created By</label>
                <div className="mt-1 flex items-center">
                  <img
                    src={getAvatarUrl(user.name)}
                    alt={user.name}
                    className="h-6 w-6 md:h-8 md:w-8 rounded-full ring-1 ring-white"
                  />
                  <div className="ml-2 md:ml-3">
                    <p className="text-xs md:text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs md:text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-6 flex flex-col gap-2 md:gap-3">
            <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">Quick Actions</h2>
            <button className="w-full btn btn-primary inline-flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-2">
              <FiDownload className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Download All
            </button>
            <button className="w-full btn btn-secondary inline-flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm py-2">
              <FiShare2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Share Album
            </button>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div id="photos-section" className="bg-white rounded-xl border border-gray-200 p-3 md:p-6">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-3 md:mb-6 gap-2">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">Photos</h2>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-600">
            <FiImage className="mr-1 h-3 w-3 md:h-4 md:w-4" />
            {photos.length} Photos
          </span>
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
          {currentPhotos.map((photo, idx) => (
            <button
              key={photo.id}
              type="button"
              className="group relative aspect-square overflow-hidden rounded-lg md:rounded-xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => handlePhotoClick(idx)}
              aria-label={`View photo: ${photo.title}`}
            >
              <img
                src={photo.thumbnailUrl}
                alt={photo.title}
                className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                loading="lazy"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-1.5 md:p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs text-white line-clamp-2">{photo.title}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Pagination */}
        {totalPhotoPages > 1 && (
          <div className="flex justify-center items-center flex-wrap gap-1 md:gap-2 mt-4 md:mt-6">
            {/* Mobile simplified pagination */}
            {isMobile ? (
              <>
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPhotoPage - 1))}
                  disabled={currentPhotoPage === 1}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center py-1.5 px-3 text-xs"
                  aria-label="Previous page"
                >
                  <FiChevronLeft className="mr-1" /> Prev
                </button>
                <span className="text-xs md:text-sm font-medium text-gray-700 px-2">
                  Page {currentPhotoPage} of {totalPhotoPages}
                </span>
                <button
                  onClick={() => handlePageChange(Math.min(totalPhotoPages, currentPhotoPage + 1))}
                  disabled={currentPhotoPage === totalPhotoPages}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center py-1.5 px-3 text-xs"
                  aria-label="Next page"
                >
                  Next <FiChevronRight className="ml-1" />
                </button>
              </>
            ) : (
              // Desktop full pagination
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPhotoPage === 1}
                  className="hidden sm:flex btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed items-center py-1.5 px-3 text-xs"
                  aria-label="First page"
                >
                  <FiChevronsLeft className="mr-1" /> First
                </button>
                <button
                  onClick={() => handlePageChange(currentPhotoPage - 1)}
                  disabled={currentPhotoPage === 1}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center py-1.5 px-3 text-xs"
                  aria-label="Previous page"
                >
                  <FiChevronLeft className="mr-1" /> Prev
                </button>
                
                <div className="flex items-center space-x-1">
                  {/* Dynamic page numbers with ellipsis */}
                  {Array.from({ length: totalPhotoPages }, (_, i) => i + 1)
                    .filter(pageNum => {
                      // Show first page, last page, current page, and pages around current
                      return (
                        pageNum === 1 ||
                        pageNum === totalPhotoPages ||
                        (pageNum >= currentPhotoPage - 1 && pageNum <= currentPhotoPage + 1)
                      );
                    })
                    .map((pageNum, index, array) => {
                      // Add ellipsis if pages are skipped
                      const showEllipsisBefore = index > 0 && pageNum > array[index - 1] + 1;
                      
                      return (
                        <React.Fragment key={pageNum}>
                          {showEllipsisBefore && (
                            <span className="text-gray-500 px-1">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors duration-200 ${
                              pageNum === currentPhotoPage
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            aria-label={`Page ${pageNum}`}
                            aria-current={pageNum === currentPhotoPage ? 'page' : undefined}
                          >
                            {pageNum}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPhotoPage + 1)}
                  disabled={currentPhotoPage === totalPhotoPages}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center py-1.5 px-3 text-xs"
                  aria-label="Next page"
                >
                  Next <FiChevronRight className="ml-1" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPhotoPages)}
                  disabled={currentPhotoPage === totalPhotoPages}
                  className="hidden sm:flex btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed items-center py-1.5 px-3 text-xs"
                  aria-label="Last page"
                >
                  Last <FiChevronsRight className="ml-1" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Photo Viewer Modal */}
      {viewerOpen && (
        <PhotoViewerModal
          photos={photos}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
};

export default AlbumDetail;