import React from 'react'

const AlbumImages = ({ album }) => {
    console.log('Album:', album);
  return (
    <div>
        <div className=''>
            <div className='p-5'>
                {album.length > 0 ? (
                    <div className="">
                        {/* Loop through images in the album */}
                        <h1>CONTAINS IMAGES</h1>
                        {/* {album.map((image) => (
                            <div key={image.id} className="border border-gray-300 p-2 rounded-md">
                                <img src={image.url} alt={image.name} className="w-full h-full object-cover rounded-md" />
                            </div>
                        ))} */}
                    </div>
                ) : (
                        <button className="flex justify-center items-center p-4 w-48 h-48 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition hover:cursor-pointer">
                            <span className="text-4xl font-bold">+</span>
                            <p className="mt-2">Add Image</p>
                        </button>
                )}
            </div>
        </div>

    </div>
  )
}

export default AlbumImages
