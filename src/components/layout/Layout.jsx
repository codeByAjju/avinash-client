import { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router';
import { Menu, X, Youtube, Instagram, ArrowUpRight } from 'lucide-react';
import { Button } from '../common/UI';
import { socialLinks } from '../../utils/site';
const links = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/music', 'Music'],
  ['/videos', 'Videos'],
  ['/live-shows', 'Live Shows'],
  ['/gallery', 'Gallery'],
  ['/contact', 'Contact'],
];
function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Avinash Gupta home">
      <span>
        AVINASH GUPTA<span className="brand-dot">.</span>
      </span>
      <small>THE OFFICIAL WEBSITE</small>
    </Link>
  );
}
export function BookingCTA() {
  return (
    <section className="booking-banner container">
      <EyebrowLine />
      <h2>
        Make your next event
        <br />
        <em>unforgettable.</em>
      </h2>
      <p>
        A concert. A celebration. A room full of memories.
        <br />
        Let’s bring your people together through music.
      </p>
      <Button to="/contact">Enquire about bookings</Button>
    </section>
  );
}
function EyebrowLine() {
  return (
    <div className="eyebrow">
      <span className="gold-line" />
      LET’S MAKE A MOMENT
    </div>
  );
}
export default function Layout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 32);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const listener = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header
        className={`site-header ${scrolled || pathname !== '/' ? 'solid' : ''} ${open ? 'menu-open' : ''}`}
      >
        <div className="nav-wrap">
          <Brand />
          <button
            id="menu-toggle"
            className="menu-toggle icon-button"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav id="main-navigation" className={open ? 'is-open' : ''} aria-label="Main navigation">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}>
                {label}
              </NavLink>
            ))}
            <Button to="/contact" className="nav-booking">
              Book for an event
            </Button>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-top">
          <div>
            <Brand />
            <p>
              Melodies. Memories.
              <br />
              And everything in between.
            </p>
          </div>
          <div>
            <h3 className="footer-heading" id="footer-explore">
              Explore the music
            </h3>
            <nav className="footer-links" aria-labelledby="footer-explore">
              {links.slice(1).map(([to, label]) => (
                <Link to={to} key={to}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="footer-connect">
            <h3 className="footer-heading">Stay in tune</h3>
            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
              <Youtube size={18} />
              YouTube
              <ArrowUpRight size={14} />
            </a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram size={18} />
              Instagram
              <ArrowUpRight size={14} />
            </a>
            <a href={socialLinks.spotify} target="_blank" rel="noopener noreferrer">
              Spotify
              <ArrowUpRight size={14} />
            </a>
            <a href={socialLinks.apple} target="_blank" rel="noopener noreferrer">
              Apple Music
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Avinash Gupta. All rights reserved.</span>
          <span>MADE FOR THE LOVE OF MUSIC</span>
          <Link to="/contact">Let’s connect ↗</Link>
        </div>
      </footer>
    </>
  );
}
