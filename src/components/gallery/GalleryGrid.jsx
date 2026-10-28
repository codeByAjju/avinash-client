import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { Picture } from '../common/UI';
import { Lightbox } from '../common/Modal';
export default function GalleryGrid({ images, preview = false }) {
  const [index, setIndex] = useState(null);
  return (
    <>
      <div className={`gallery-grid ${preview ? 'gallery-preview' : ''}`}>
        {images.map((image, i) => (
          <button
            className="gallery-image"
            key={image._id || image.imagePath}
            onClick={() => setIndex(i)}
            aria-label={`View photograph: ${image.altText}`}
          >
            <Picture src={image.imagePath} alt={image.altText} width={600} height={700} />
            <span>
              <Maximize2 size={20} aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>
      {index !== null && (
        <Lightbox
          images={images}
          index={index}
          setIndex={setIndex}
          onClose={() => setIndex(null)}
        />
      )}
    </>
  );
}
