import { Link } from 'react-router-dom';
import { FiCheckCircle, FiExternalLink, FiGithub, FiImage, FiUsers } from 'react-icons/fi';

const requirements = [
  'Album list as a table with ID, Title, User (avatar & name), Actions, pagination synced with URL',
  'Album detail with user info, album title, and list of photos (thumbnails, click to view full)',
  'User list as a table with ID, Avatar, Name, Email, Phone, Website, Actions',
  "User detail with user info and list of user's albums",
  'Responsive layout for 1280px+ screens',
  'Tidy UI, reasonable colors, loading states, pointer cursor on clickable elements',
  'Clickable emails/phones, external links open in new tab, all img tags have alt',
  'Organized, readable, and error-free source code',
];

const implemented = [
  'All requirements above are implemented',
  'Modern, responsive UI with Tailwind CSS',
  'React Query for data fetching and caching',
  'URL-synced pagination for albums',
  'Accessible, pixel-perfect design',
  'Screenshots and source code provided',
];

export default function Home() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <h1 className="text-3xl font-display font-bold mb-2">Geek Up Technical Assessment</h1>
        <p className="text-gray-600 mb-2">by Albert AnhDung</p>
        <p className="text-gray-700">This web app is a technical assessment for Geek Up, built with React, React Query, and Tailwind CSS. It demonstrates a modern, responsive dashboard for managing albums and users, integrating with the JSONPlaceholder API and UI Avatars.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-3">Assessment Requirements</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-3">What's Implemented</h2>
          <ul className="space-y-2">
            {implemented.map((item, i) => (
              <li key={i} className="flex items-center text-green-700"><FiCheckCircle className="mr-2 text-green-500" /> {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-3">Screenshots</h2>
        <p className="text-gray-600 mb-2">Screenshots of the running app are attached in the submission folder as required.</p>
        {/* You can add <img> tags here if you want to display screenshots inline */}
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Source Code</h2>
          <p className="text-gray-600 mb-2">The full source code is included in the submission and available at:</p>
          <a href="https://github.com/AlbertDung/PRODUCT-FRONTEND-TECHNICAL-ASSESSMENT-GEEK-UP.git" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary-600 hover:underline"><FiGithub className="mr-2" /> GitHub Repository <FiExternalLink className="ml-1" /></a>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Link to="/albums" className="btn btn-primary flex items-center gap-2"><FiImage /> Album List</Link>
          <Link to="/users" className="btn btn-secondary flex items-center gap-2"><FiUsers /> User List</Link>
        </div>
      </div>
    </div>
  );
} 