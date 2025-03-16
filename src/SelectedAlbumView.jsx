import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRequest } from './utils/api';
import SelectedAlbumNavbar from './SelectedAlbumNavbar';

const SelectedAlbumView = () => {
    const [album, setAlbum] = useState({});
    const { id } = useParams();
    console.log('id', id);

    const fetchlAlbumById = async () => {
        try {
            const data = await getRequest(`/albums/${id}`);
            setAlbum(data);
            console.log('Album by ID:', data);
        } catch (error) {
            console.error('Fetch album by ID error:', error);
        }
    };

    useEffect(() => {
        fetchlAlbumById();
    }
    , [id]);

    console.log('Selected album:', album);

  return (
    <div className="pt-25"> {/* Adjust pt-16 to match your navbar height */}
        <SelectedAlbumNavbar albumName={album.name} albumDescription={album.description} />
        {/* <div>
            <h1>Selected Album</h1>
            <p>Album ID: {id}</p>
            <p>Name: {album.name}</p>
            <p>Description: {album.description}</p>
        </div> */}
    </div>
  )
}

export default SelectedAlbumView
