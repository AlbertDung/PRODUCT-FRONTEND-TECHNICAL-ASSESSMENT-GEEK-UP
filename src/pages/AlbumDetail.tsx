import React from 'react';
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
  const [photoPage, setPhotoPage] = React.useState(1);
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [viewerIndex, setViewerIndex] = React.useState(0);

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
  const startPhotoIdx = (photoPage - 1) * PHOTOS_PER_PAGE;
  const endPhotoIdx = startPhotoIdx + PHOTOS_PER_PAGE;
  const currentPhotos = photos?.slice(startPhotoIdx, endPhotoIdx) || [];

  const handlePhotoClick = (idx: number) => {
    setViewerOpen(true);
    setViewerIndex(startPhotoIdx + idx);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600"></div>
      </div>
    );
  }

  if (!album || !user || !photos) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <FiImage className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Album not found</h2>
        <p className="text-gray-600 mb-6">The album you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/albums')}
          className="btn btn-primary inline-flex items-center"
        >
          <FiArrowLeft className="mr-2" />
          Back to Albums
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/albums')}
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">{album.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Created by {user.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary inline-flex items-center gap-2">
            <FiEdit2 className="w-4 h-4" />
            Edit Album
          </button>
          <button className="btn btn-danger inline-flex items-center gap-2">
            <FiTrash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Album Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Album Information</h2>
              <button className="text-gray-400 hover:text-gray-500">
                <FiMoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Title</label>
                <p className="mt-1 text-sm text-gray-900">{album.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Description</label>
                <p className="mt-1 text-sm text-gray-900">
                  A collection of photos showcasing various moments and memories.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Created By</label>
                <div className="mt-1 flex items-center">
                  <img
                    src={getAvatarUrl(user.name)}
                    alt={user.name}
                    className="h-8 w-8 rounded-full ring-2 ring-white"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Quick Actions</h2>
            <button className="w-full btn btn-primary inline-flex items-center justify-center gap-2">
              <FiDownload className="w-4 h-4" />
              Download All
            </button>
            <button className="w-full btn btn-secondary inline-flex items-center justify-center gap-2">
              <FiShare2 className="w-4 h-4" />
              Share Album
            </button>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2 sm:gap-0">
          <h2 className="text-lg font-semibold text-gray-900">Photos</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-600">
            <FiImage className="mr-2 h-4 w-4" />
            {photos.length} Photos
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {currentPhotos.map((photo, idx) => (
            <button
              key={photo.id}
              type="button"
              className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 focus:outline-none"
              onClick={() => handlePhotoClick(idx)}
              aria-label={`View photo: ${photo.title}`}
            >
              <img
                src={photo.thumbnailUrl}
                alt={photo.title}
                className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs text-white line-clamp-2">{photo.title}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Pagination */}
        {totalPhotoPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setPhotoPage(1)}
              disabled={photoPage === 1}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              aria-label="First page"
            >
              <FiChevronsLeft className="mr-1" /> First
            </button>
            <button
              onClick={() => setPhotoPage(photoPage - 1)}
              disabled={photoPage === 1}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              aria-label="Previous page"
            >
              <FiChevronLeft className="mr-1" /> Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPhotoPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPhotoPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pageNum === photoPage
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
              onClick={() => setPhotoPage(photoPage + 1)}
              disabled={photoPage === totalPhotoPages}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              aria-label="Next page"
            >
              Next <FiChevronRight className="ml-1" />
            </button>
            <button
              onClick={() => setPhotoPage(totalPhotoPages)}
              disabled={photoPage === totalPhotoPages}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              aria-label="Last page"
            >
              Last <FiChevronsRight className="ml-1" />
            </button>
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