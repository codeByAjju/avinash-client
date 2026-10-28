import { useState } from 'react';
import { PageIntro, DataState, Pagination } from '../components/common/UI';
import MusicCard from '../components/music/MusicCard';
import { VideoModal } from '../components/common/Modal';
import { BookingCTA } from '../components/layout/Layout';
import useApi from '../hooks/useApi';
export default function Music() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('All music');
  const [playing, setPlaying] = useState(null);
  const catalogue = useApi(`/music?limit=50&page=${page}`);
  const categories = ['All music', ...new Set(catalogue.data.map((item) => item.category))];
  const visible =
    category === 'All music'
      ? catalogue.data
      : catalogue.data.filter((item) => item.category === category);
  return (
    <>
      <PageIntro
        eyebrow="THE CATALOGUE"
        title={
          <>
            Music that lives
            <br />
            <em>beyond time.</em>
          </>
        }
      >
        From familiar favourites to new discoveries. Find a melody that stays with you.
      </PageIntro>
      <section className="container catalogue-section">
        {catalogue.data.length > 4 && (
          <div className="filter-bar" role="group" aria-label="Filter music by category">
            {categories.map((item) => (
              <button
                key={item}
                aria-pressed={category === item}
                className={category === item ? 'active' : ''}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        )}
        <DataState state={catalogue}>
          <div className="music-grid">
            {visible.map((item, i) => (
              <MusicCard
                key={item._id}
                item={item}
                onPlay={setPlaying}
                number={i + (page - 1) * 50}
              />
            ))}
          </div>
        </DataState>
        <Pagination
          page={page}
          meta={catalogue.meta}
          onChange={(value) => {
            setPage(value);
            setCategory('All music');
          }}
        />
        <p className="catalogue-credit">
          Covers, renditions, and live performances are labelled individually. All listening links
          lead to artist-linked official destinations.
        </p>
      </section>
      <BookingCTA />
      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
    </>
  );
}
