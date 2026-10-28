import { useState } from 'react';
import { PageIntro, Picture, Pagination } from '../components/common/UI';
import Events from '../components/events/Events';
import { BookingCTA } from '../components/layout/Layout';
import useApi from '../hooks/useApi';
export default function LiveShows() {
  const [view, setView] = useState('upcoming');
  const [page, setPage] = useState(1);
  const state = useApi(`/events/${view}?limit=12&page=${page}`);
  return (
    <>
      <PageIntro
        eyebrow="THE LIVE EXPERIENCE"
        title={
          <>
            See you
            <br />
            <em>in the crowd.</em>
          </>
        }
      >
        The songs you know. The feeling you came for. A moment we share.
      </PageIntro>
      <div className="shows-photo container">
        <Picture
          src="/images/DSC00871.jpeg"
          alt="Avinash Gupta in front of a concert audience holding up phone lights"
          width={2000}
          height={1333}
          eager
        />
      </div>
      <section className="container section">
        <div className="filter-bar" role="group" aria-label="Filter performances by date">
          {['upcoming', 'past'].map((item) => (
            <button
              className={view === item ? 'active' : ''}
              aria-pressed={view === item}
              onClick={() => {
                setView(item);
                setPage(1);
              }}
              key={item}
            >
              {item === 'upcoming' ? 'Upcoming shows' : 'Past performances'}
            </button>
          ))}
        </div>
        <Events state={state} past={view === 'past'} />
        <Pagination page={page} meta={state.meta} onChange={setPage} />
      </section>
      <BookingCTA />
    </>
  );
}
