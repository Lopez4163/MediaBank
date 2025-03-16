import React, { useState } from 'react';
import { postRequest } from './utils/api';
import { useNavigate } from 'react-router-dom';

const CreateAlbum = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = parseInt(localStorage.getItem('userId')); 
    console.log(userId);

    const albumData = {
      name,
      description,
      userId,
    };

    try {
      const response = await postRequest('/albums', albumData);
      console.log('Album created:', response);
      // Redirect or show success message
      navigate('/dashboard');
    } catch (err) {
      setError('Error creating album');
      console.error('Error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Create Album
        </h2>
        
        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Album Name */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Album Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              placeholder="Enter album name"
            />
          </div>

          {/* Description */}
          <div>
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300 resize-none"
              placeholder="Enter album description"
              rows="3"
            />
          </div>

          {/* Category (optional) */}
          {/* 
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            >
              <option value="">Select a category</option>
              <option value="1">Nature</option>
              <option value="2">Travel</option>
              <option value="3">Family</option>
            </select>
          </div>
          */}

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 font-medium"
          >
            Create Album
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAlbum;
