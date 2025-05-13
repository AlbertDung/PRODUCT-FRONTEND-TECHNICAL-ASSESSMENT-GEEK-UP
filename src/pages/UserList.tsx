import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiPlus, FiEye } from 'react-icons/fi';
import { getUsers, getAvatarUrl } from '../services/api';
import type { User } from '../types';
import Pagination from '../components/Pagination';

const DEFAULT_PAGE_SIZE = 8;

const UserList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageSize, setCurrentPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 640);

  // Update isMobileView state when window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredUsers.length / currentPageSize);
  const startIndex = (currentPage - 1) * currentPageSize;
  const endIndex = startIndex + currentPageSize;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handlePageSizeChange = (newSize: number) => {
    setCurrentPageSize(newSize);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-3 md:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts and permissions
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
            onClick={() => navigate('/users/new')}
            className="btn btn-primary inline-flex items-center gap-2 text-sm py-2 px-3 md:py-2 md:px-4"
          >
            <FiPlus className="w-4 h-4" />
            <span className="hidden xs:inline">New User</span>
            <span className="xs:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="input pl-10 w-full py-2 text-sm md:text-base"
          />
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
              <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select id="role-filter" className="input w-full text-sm">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="guest">Guest</option>
              </select>
            </div>
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select id="status-filter" className="input w-full text-sm">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select id="sort-by" className="input w-full text-sm">
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="date">Date Added</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => isMobileView ? navigate(`/users/${user.id}`) : null}
                >
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10">
                        <img
                          src={getAvatarUrl(user.name)}
                          alt={user.name}
                          className="h-8 w-8 md:h-10 md:w-10 rounded-full ring-1 ring-white"
                        />
                      </div>
                      <div className="ml-2 md:ml-4">
                        <div className="text-xs md:text-sm font-medium text-gray-900 line-clamp-1">{user.name}</div>
                        <div className="text-xs text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-xs md:text-sm text-gray-900">{user.email}</div>
                    <div className="text-xs md:text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right text-xs md:text-sm font-medium">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/users/${user.id}`); }}
                      className="btn btn-primary inline-flex items-center gap-1.5 py-1.5 px-3 text-xs md:text-sm"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
            <FiSearch className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          pageSize={currentPageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

export default UserList; 