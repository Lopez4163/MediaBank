import React, { useState } from 'react';
import { postRequest } from './utils/api';

const AlbumImages = ({ album }) => {
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Handle image selection
const handleImageChange = (event) => {
    const selectedFile = event.target.files[0]; // Get the first file from the input
    if (selectedFile) {
      setImage(selectedFile); // Set the selected file in state
    }
  };
  

  const handleImageUpload = async () => {
    if (!image) {
      setUploadError('Please select an image to upload.');
      return;
    }
  
    setIsUploading(true);
  
    // Create a new FormData object
    const formData = new FormData();
    formData.append('image', image); // Ensure this matches Multer's field name
    formData.append('albumName', album.name); // Ensure this is not undefined
    formData.append('albumId', album.id); // Ensure this is not undefined
    formData.append('userId', album.userId); // Ensure this is not undefined
    formData.append('path', album.path); // Ensure this is not undefined
  
    // Log FormData contents for debugging
    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
  
    try {
      const response = await fetch('http://localhost:3000/upload-image', {
        method: 'POST',
        body: formData, // No need to set Content-Type header manually
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Image uploaded successfully:', data);
        setIsUploading(false);
        setImage(null); // Clear selected image
      } else {
        const errorData = await response.json();
        console.error('Error uploading image:', errorData);
        setUploadError('Failed to upload image.');
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image.');
      setIsUploading(false);
    }
  };
  
  
  return (
    <div>
      <div className="p-5">
        {album.images && album.images.length > 0 ? (
          <div>
            {/* Loop through images in the album */}
            <h1>CONTAINS IMAGES</h1>
            {album.images.map((image) => (
              <div key={image.id} className="border border-gray-300 p-2 rounded-md">
                <img src={image.url} alt={image.name} className="w-full h-full object-cover rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => document.getElementById('imageInput').click()}  // Trigger file input
              className="flex justify-center items-center p-4 w-48 h-48 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition hover:cursor-pointer"
            >
              <span className="text-4xl font-bold">+</span>
              <p className="mt-2">Add Image</p>
            </button>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            {image && (
              <div className="mt-4">
                <p>Selected image: {image.name}</p>
                <button
                  onClick={handleImageUpload}
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
                {uploadError && <p className="text-red-500">{uploadError}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumImages;
