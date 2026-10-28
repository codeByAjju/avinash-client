import { useState } from 'react';
import { Play } from 'lucide-react';
import { PageIntro, DataState, Picture, Button, Pagination } from '../components/common/UI';
import MusicCard from '../components/music/MusicCard';
import { VideoModal } from '../components/common/Modal';
import useApi from '../hooks/useApi';
export default function Videos() {
  const [playing, setPlaying] = useState(null);
  const [page, setPage] = useState(1);
  const state = useApi(`/videos?limit=12&page=${page}`);
  const featured = state.data[0];
  return (
    <>
      <PageIntro
        eyebrow="WATCH & FEEL"
        title={
          <>
            The music.
            <br />
            <em>In the moment.</em>
          </>
        }
      >
        Live stages, intimate renditions, and songs worth pressing play for.
      </PageIntro>
      <section className="container catalogue-section">
        <DataState state={state}>
          {featured && page === 1 && (
            <article className="video-feature">
              <button
                className="featured-visual"
                onClick={() => setPlaying(featured)}
                aria-label={`Play ${featured.title}`}
              >
                <Picture
                  src={featured.thumbnail}
                  alt={`${featured.title} official video thumbnail`}
                />
                <span className="large-play">
                  <Play fill="currentColor" />
                </span>
              </button>
              <div>
                <span className="small-label">FEATURED / {featured.category}</span>
                <h2>{featured.title}</h2>
                <p>{featured.description}</p>
                <Button href={featured.youtubeUrl} variant="outline">
                  Watch on YouTube
                </Button>
              </div>
            </article>
          )}
          <div className="music-grid video-grid">
            {state.data.slice(page === 1 ? 1 : 0).map((item, i) => (
              <MusicCard key={item._id} item={item} number={i} onPlay={setPlaying} />
            ))}
          </div>
        </DataState>
        <Pagination page={page} meta={state.meta} onChange={setPage} />
      </section>
      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
    </>
  );
}
