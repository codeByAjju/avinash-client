import { useRef, useEffect, useId } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { videoId } from '../../utils/site';
import { Picture } from './UI';
export function Modal({ title, children, onClose, className = '', onKeyDown }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={`modal ${className}`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      onKeyDown={onKeyDown}
    >
      <div className="modal-shell">
        <div className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog" autoFocus>
            <X />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
export function VideoModal({ video, onClose }) {
  const id = videoId(video.youtubeUrl);
  return (
    <Modal title={video.title} onClose={onClose} className="video-modal">
      {id && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
          title={video.title}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
      <p className="modal-note">
        {video.description || 'An official artist performance.'}
        <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
          Watch on YouTube ↗
        </a>
      </p>
    </Modal>
  );
}
export function Lightbox({ images, index, setIndex, onClose }) {
  const image = images[index];
  const previous = () => setIndex((index + images.length - 1) % images.length);
  const next = () => setIndex((index + 1) % images.length);
  return (
    <Modal
      title={image.title}
      onClose={onClose}
      className="lightbox"
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') previous();
        if (event.key === 'ArrowRight') next();
      }}
    >
      <Picture key={image.imagePath} src={image.imagePath} alt={image.altText} eager />
      <div className="lightbox-controls">
        <button className="icon-button" onClick={previous} aria-label="Previous photograph">
          <ChevronLeft />
        </button>
        <span aria-live="polite">
          {index + 1} / {images.length}
        </span>
        <button className="icon-button" onClick={next} aria-label="Next photograph">
          <ChevronRight />
        </button>
      </div>
    </Modal>
  );
}
