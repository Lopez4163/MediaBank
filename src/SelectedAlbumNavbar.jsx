import React from 'react'
import { deleteRequest } from './utils/api';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const SelectedAlbumNavbar = ({ albumName, albumDescription}) => {
    const navigate = useNavigate();
    const { id } = useParams();

        const deleteAlbums = async (id) => {
            const isConfirmed = window.confirm("Are you sure you want to delete this album?");
        
            if (!isConfirmed) return;
        
            try {
                // Make a request to the backend to delete an album
                const data = await deleteRequest(`/albums/${id}/delete`);
                console.log("Album deleted:", data);
                alert("Album deleted successfully!");
                navigate('/dashboard');
                    
            } catch (error) {
                console.error("Delete album error:", error);
            }
        }
        

  return (
    <nav className='shadow-md w-full z-10 bg-gray-800 text-white'>
        <div className="p-2">
            <ul className="flex justify-around items-center h-16">
                {/* Logo */}
                <li>
                    <div className='flex flex-col'>
                        <p className='text-sm'>
                            Album Name:
                        </p>
                        <p className='text-xl font-semibold'>
                            {albumName}
                        </p>
                    </div>
                </li>

                {/* Links and Buttons */}
                <li>
                    <div>
                        <p className='text-sm'>Description</p>
                        <p className="text-white">
                            {albumDescription}
                        </p>
                    </div>
                </li>
                <li>
                    <button onClick={() => deleteAlbums(id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 hover:cursor-pointer">
                        Delete Album
                    </button>
                </li>
            </ul>
        </div>

    </nav>
  )
}

export default SelectedAlbumNavbar