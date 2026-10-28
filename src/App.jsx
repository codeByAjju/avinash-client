import { lazy, Suspense, useEffect, Component } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
const About = lazy(() => import('./pages/About'));
const Music = lazy(() => import('./pages/Music'));
const Videos = lazy(() => import('./pages/Videos'));
const LiveShows = lazy(() => import('./pages/LiveShows'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));
const metadata = {
  '/': [
    'Playback Singer & Live Performer',
    'Explore the official music, videos and live performances of Avinash Gupta.',
  ],
  '/about': [
    'The Artist',
    'Meet Avinash Gupta through his music, live performances, and connection to melody and memory.',
  ],
  '/music': [
    'Music & Renditions',
    'Discover verified covers, devotional renditions, mashups and official music by Avinash Gupta.',
  ],
  '/videos': [
    'Official Videos',
    'Watch Avinash Gupta’s official live concerts, covers, music videos and mashups.',
  ],
  '/live-shows': [
    'Live Shows',
    'Find confirmed upcoming shows and verified past performances by Avinash Gupta.',
  ],
  '/gallery': [
    'Gallery',
    'Artist portraits and on-stage moments from Avinash Gupta’s official public profiles.',
  ],
  '/contact': [
    'Bookings & Contact',
    'Enquire about Avinash Gupta live performances, concerts, private events and collaborations.',
  ],
  '/admin': ['Artist Studio', 'Private content and enquiry management.'],
};
function Metadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const [title, description] = metadata[pathname] || [
      'Page Not Found',
      'Return to the official website of Avinash Gupta.',
    ];
    document.title = `Avinash Gupta | ${title}`;
    for (const [selector, content] of [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', document.title],
      ['meta[property="og:description"]', description],
    ])
      document.querySelector(selector)?.setAttribute('content', content);
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.append(robots);
    }
    robots.content = pathname.startsWith('/admin') ? 'noindex,nofollow' : 'index,follow';
  }, [pathname]);
  return null;
}
class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="fatal-error">
        <h1>A little pause.</h1>
        <p>The page couldn’t load. Please refresh to try again.</p>
        <a className="button button-gold" href="/">
          Return home
        </a>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  return (
    <ErrorBoundary>
      <Metadata />
      <Suspense
        fallback={
          <div className="route-loading" role="status">
            A moment for the music…
          </div>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="music" element={<Music />} />
            <Route path="videos" element={<Videos />} />
            <Route path="live-shows" element={<LiveShows />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
