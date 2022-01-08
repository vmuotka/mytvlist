import React from 'react'
import Youtube from 'react-youtube'

const Trailer = ({ videos }) => {
    const trailer = videos.filter(video => (video.type.toLowerCase() === 'trailer' || video.type.toLowerCase() === 'teaser') && video.site.toLowerCase() === 'youtube')[0]

    return (
        <>
            <div className='flex justify-center'>
                {trailer &&
                    <Youtube
                        className=''
                        key={trailer.key}
                        videoId={trailer.key}
                        title={trailer.name}
                    />
                }
            </div>

        </>
    )
}

export default Trailer