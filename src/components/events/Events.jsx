import { Link } from 'react-router';
import { ArrowUpRight, MapPin, CalendarDays } from 'lucide-react';
import { dateParts } from '../../utils/site';
import { Button, DataState } from '../common/UI';
export default function Events({ state, past = false }) {
  if (!state.loading && !state.error && !state.data.length)
    return (
      <div className="empty-state event-empty">
        <CalendarDays size={25} />
        <h3>{past ? 'More memories to come.' : 'Meet you at the next show.'}</h3>
        <p>
          {past
            ? 'Verified past performances will appear here.'
            : 'No upcoming shows have been announced just yet.'}
        </p>
        <Button to="/contact" variant="outline">
          Bring the music to your city
        </Button>
      </div>
    );
  return (
    <DataState state={state}>
      <div className="events-list">
        {state.data.map((event) => {
          const date = dateParts(event.date);
          return (
            <article className="event-row" key={event._id}>
              <time className="event-date" dateTime={event.date}>
                <strong>{date.day}</strong>
                <span>
                  {date.month} {date.year}
                </span>
              </time>
              <div className="event-details">
                <span className="small-label">{event.city}</span>
                <h3>{event.title}</h3>
                <p>
                  <MapPin size={13} aria-hidden="true" />
                  {event.venue}
                </p>
              </div>
              {!past && event.ticketUrl ? (
                <Button href={event.ticketUrl} variant="outline">
                  View tickets
                </Button>
              ) : (
                <span className="past-label">
                  A memory made
                  <ArrowUpRight size={15} />
                </span>
              )}
            </article>
          );
        })}
      </div>
      {!past && (
        <p className="events-note">
          For current ticket information, visit the official booking partner.{' '}
          <Link to="/contact">Organising a show? Let’s talk ↗</Link>
        </p>
      )}
    </DataState>
  );
}
