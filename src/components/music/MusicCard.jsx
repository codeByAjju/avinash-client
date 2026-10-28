import { Play, ArrowUpRight } from 'lucide-react';
import { Picture } from '../common/UI';
export default function MusicCard({ item, onPlay, number }) {
  const content = (
    <>
      <Picture src={item.thumbnail} alt={`${item.title} video artwork`} />
      <span className="card-play">
        <Play size={22} fill="currentColor" aria-hidden="true" />
      </span>
      <span className="artwork-category">{item.category}</span>
    </>
  );
  return (
    <article className="music-card">
      {item.youtubeUrl ? (
        <button
          className="card-artwork"
          aria-label={`Play ${item.title}`}
          onClick={() => onPlay(item)}
        >
          {content}
        </button>
      ) : (
        <a
          className="card-artwork"
          href={item.streamingUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Listen to ${item.title}`}
        >
          {content}
        </a>
      )}
      <div className="music-card-info">
        <span className="track-index">{String(number + 1).padStart(2, '0')}</span>
        <div>
          <h3>{item.title}</h3>
          <p>{item.artistCredit || item.description}</p>
        </div>
        <a
          href={item.youtubeUrl || item.streamingUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${item.title} on its official platform`}
        >
          <ArrowUpRight size={18} />
        </a>
      </div>
    </article>
  );
}
