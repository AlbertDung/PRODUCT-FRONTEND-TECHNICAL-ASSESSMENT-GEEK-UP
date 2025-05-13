import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiUsers, FiImage, FiActivity, FiTrendingUp } from 'react-icons/fi';
import { getUsers, getAlbums } from '../services/api';
import type { User, Album } from '../types';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [showFilters, setShowFilters] = useState(false);

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { data: albums, isLoading: isLoadingAlbums } = useQuery<Album[]>({
    queryKey: ['albums'],
    queryFn: getAlbums,
  });

  const isLoading = isLoadingUsers || isLoadingAlbums;

  // Mock data for charts (replace with real data in production)
  const userGrowth = [
    { date: '2024-01', users: 120 },
    { date: '2024-02', users: 150 },
    { date: '2024-03', users: 180 },
    { date: '2024-04', users: 220 },
  ];

  const albumStats = [
    { category: 'Nature', count: 45 },
    { category: 'Portrait', count: 30 },
    { category: 'Landscape', count: 25 },
    { category: 'Other', count: 20 },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-100 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor your application's performance and user engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <FiActivity className="w-4 h-4" />
            Filters
          </button>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{users?.length || 0}</h3>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <FiUsers className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-600 dark:text-green-400">
            <FiTrendingUp className="w-4 h-4 mr-1" />
            <span>12% increase</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Albums</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{albums?.length || 0}</h3>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <FiImage className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-600 dark:text-green-400">
            <FiTrendingUp className="w-4 h-4 mr-1" />
            <span>8% increase</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,234</h3>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <FiUsers className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-600 dark:text-green-400">
            <FiTrendingUp className="w-4 h-4 mr-1" />
            <span>5% increase</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Photos</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">5,678</h3>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <FiImage className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm text-green-600 dark:text-green-400">
            <FiTrendingUp className="w-4 h-4 mr-1" />
            <span>15% increase</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Growth</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              View Details
            </button>
          </div>
          <div className="h-64">
            {/* User Growth Chart */}
            <div className="w-full h-full bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between h-full">
                {userGrowth.map((data) => (
                  <div key={data.date} className="flex flex-col items-center">
                    <div 
                      className="w-8 bg-primary-600 dark:bg-primary-500 rounded-t-sm"
                      style={{ height: `${(data.users / 220) * 100}%` }}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">{data.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Album Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Album Categories</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {albumStats.map((stat, index) => (
              <div key={index} className="flex items-center">
                <div className="w-24 text-sm text-gray-500 dark:text-gray-400">{stat.category}</div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 dark:bg-primary-500 rounded-full"
                      style={{ width: `${(stat.count / 100) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-medium text-gray-900 dark:text-white">
                  {stat.count}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
              <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <FiActivity className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">New album created</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-700">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics; 