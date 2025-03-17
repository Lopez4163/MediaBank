import React from 'react';
import { Link } from 'react-router-dom';

const DashboardView = ({ albums, handleDelete }) => {
  console.log('albums', albums);

  return (
    <div className="pt-25"> {/* Adding padding-top to avoid content being under the fixed navbar */}
      {/* <h1 className="text-3xl font-bold text-center mb-6">Dashboard View</h1> */}
      <h2 className="text-3xl font-bold text-center mb-6">Albums</h2>

      {/* Container for the album grid */}
      <div className="flex flex-wrap gap-20 justify-center">
        {albums.map((album) => (
          <div
            key={album.id}
            className="flex flex-col items-center bg-white shadow-md rounded-lg p-4 w-64 hover:scale-105 transform transition duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{album.name}</h3>
            <p className="text-gray-600 text-sm text-center mb-4">{album.description}</p>

            {/* You can add an image or more content here in the future */}
            <div className="w-full h-32 bg-gray-300 rounded-lg mb-4"></div> {/* Placeholder for album cover */}

            {/* Optional: Add a button or link to view album */}

            <div className='flex flex-col gap-2'>
              <Link to={`/album/${album.id}`} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 hover:cursor-pointer">
                View Album
              </Link>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 hover:cursor-pointer"
              onClick={() => handleDelete(album.id)}>
                Delete Album
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;
