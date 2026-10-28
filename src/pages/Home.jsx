import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowDown, ArrowUpRight, Play, Youtube, Instagram, Music2 } from 'lucide-react';
import {
  Button,
  Eyebrow,
  SectionHeading,
  TextLink,
  Picture,
  DataState,
} from '../components/common/UI';
import { VideoModal } from '../components/common/Modal';
import { BookingCTA } from '../components/layout/Layout';
import MusicCard from '../components/music/MusicCard';
import Events from '../components/events/Events';
import GalleryGrid from '../components/gallery/GalleryGrid';
import useApi from '../hooks/useApi';
import { socialLinks } from '../utils/site';
export function ArtistIntro({ full = false }) {
  return (
    <section className={`artist-intro container ${full ? 'intro-full' : ''}`} id="artist">
      <div className="intro-photo">
        <Picture
          src="/images/DSC07565.jpeg"
          alt="Black and white portrait of Avinash Gupta seated with his hand resting against his face"
          width={842}
          height={842}
        />
        <span className="photo-caption">AVINASH GUPTA / IN HIS ELEMENT</span>
        <div className="intro-photo-line" />
      </div>
      <div className="intro-copy">
        <Eyebrow number="01">THE ARTIST</Eyebrow>
        <h2>
          More than music.
          <br />
          <em>A feeling.</em>
        </h2>
        <p className="intro-lead">
          A familiar melody. A forgotten memory.
          <br />A feeling that finds its way back.
        </p>
        <p>
          Avinash Gupta is a playback singer and live performer whose musical world brings together
          melody, memory, and emotion. From intimate renditions to the energy of a live stage,
          discover songs that feel like coming home.
        </p>
        <blockquote>
          “A voice that transcends language and genre, a keeper of memory.”
          <cite>— FROM THE ARTIST’S PUBLIC PROFILE</cite>
        </blockquote>
        {full ? (
          <Button href={socialLinks.youtube} variant="outline">
            Meet the music
          </Button>
        ) : (
          <TextLink to="/about">Discover his journey</TextLink>
        )}
      </div>
    </section>
  );
}
export default function Home() {
  const music = useApi('/music/featured?limit=3');
  const videos = useApi('/videos/featured?limit=1');
  const events = useApi('/events/upcoming?limit=3');
  const gallery = useApi('/gallery?limit=4');
  const [playing, setPlaying] = useState(null);
  return (
    <>
      <section className="hero">
        <div className="hero-image">
          <Picture
            src="/images/04.jpeg"
            alt="Avinash Gupta singing into a microphone under stage lights"
            eager
            width={1332}
            height={1333}
          />
        </div>
        <div className="hero-shade" />
        <div className="hero-content container">
          <Eyebrow>
            <span className="gold-line" />
            PLAYBACK SINGER · LIVE PERFORMER
          </Eyebrow>
          <h1>
            Some voices
            <br />
            stay with you
            <br />
            <em>forever.</em>
          </h1>
          <p>
            Melodies that move you. Memories that stay.
            <br />
            Experience the world of Avinash Gupta.
          </p>
          <div className="hero-actions">
            <Button to="/music">Explore the music</Button>
            <Link to="/contact" className="hero-secondary">
              Book a live performance
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <div className="hero-bottom container">
          <a href="#artist" className="scroll-cue">
            <span className="scroll-circle">
              <ArrowDown size={14} />
            </span>
            SCROLL TO DISCOVER
          </a>
          <span className="hero-note">A VOICE. A MEMORY. A MOMENT.</span>
          <div className="hero-social">
            <a
              href={socialLinks.instagram}
              aria-label="Avinash Gupta on Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={18} />
            </a>
            <a
              href={socialLinks.youtube}
              aria-label="Avinash Gupta on YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube size={21} />
            </a>
          </div>
        </div>
        <span className="hero-side-note">THE OFFICIAL ARTIST WEBSITE — AVINASH GUPTA</span>
      </section>
      <div className="marquee-strip" aria-label="Melodies, memories, live moments">
        <span>THE SOUND OF NOSTALGIA</span>
        <i>✦</i>
        <span>THE JOY OF A LIVE MOMENT</span>
        <i>✦</i>
        <span>MUSIC THAT FEELS LIKE HOME</span>
        <i>✦</i>
        <span>AVINASH GUPTA</span>
      </div>
      <ArtistIntro />
      <section className="section section-music">
        <div className="container">
          <SectionHeading
            eyebrow="SELECTED PERFORMANCES"
            number="02"
            title={
              <>
                Music that lives
                <br />
                <em>beyond time.</em>
              </>
            }
            link="Explore all music"
            to="/music"
          >
            Rediscover melodies that bring memories back to life.
          </SectionHeading>
          <DataState state={music}>
            <div className="music-grid">
              {music.data.map((item, i) => (
                <MusicCard key={item._id} item={item} number={i} onPlay={setPlaying} />
              ))}
            </div>
          </DataState>
          <div className="listen-line">
            <span>YOUR MUSIC. YOUR WAY.</span>
            <a href={socialLinks.spotify} target="_blank" rel="noopener noreferrer">
              Listen on Spotify
              <ArrowUpRight size={14} />
            </a>
            <a href={socialLinks.apple} target="_blank" rel="noopener noreferrer">
              Apple Music
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </section>
      <section className="section featured-section container">
        <SectionHeading
          eyebrow="THE LIVE EXPERIENCE"
          number="03"
          title={
            <>
              Some moments
              <br />
              <em>deserve a replay.</em>
            </>
          }
          link="All videos"
          to="/videos"
        />
        <DataState state={videos}>
          {videos.data[0] && (
            <div className="featured-performance">
              <button
                className="featured-visual"
                onClick={() => setPlaying(videos.data[0])}
                aria-label={`Play ${videos.data[0].title}`}
              >
                <Picture
                  src="/images/DSC00871.jpeg"
                  alt="Avinash Gupta on stage facing an audience holding up lights"
                  width={2000}
                  height={1333}
                />
                <span className="featured-visual-overlay" />
                <span className="large-play">
                  <Play size={25} fill="currentColor" />
                </span>
                <span className="featured-image-label">
                  A ROOM FULL OF VOICES. ONE SHARED FEELING.
                </span>
              </button>
              <div className="featured-caption">
                <div>
                  <span className="small-label">FEATURED PERFORMANCE / LIVE IN CONCERT</span>
                  <h3>{videos.data[0].title}</h3>
                  <p>{videos.data[0].description}</p>
                </div>
                <Button href={videos.data[0].youtubeUrl} variant="outline">
                  Watch on YouTube
                </Button>
              </div>
            </div>
          )}
        </DataState>
      </section>
      <section className="section shows-section">
        <div className="container">
          <SectionHeading
            eyebrow="ON THE ROAD"
            number="04"
            title={
              <>
                Meet you at
                <br />
                <em>the next show.</em>
              </>
            }
            link="All live shows"
            to="/live-shows"
          >
            Because music feels different when we’re in the same room.
          </SectionHeading>
          <Events state={events} />
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="THROUGH THE LENS"
          number="05"
          title={<>Between the notes.</>}
          link="View the gallery"
          to="/gallery"
        >
          A few frames from a world made of music.
        </SectionHeading>
        <DataState state={gallery} empty="The next frame is on its way.">
          <GalleryGrid images={gallery.data} preview />
        </DataState>
      </section>
      <section className="social-section container">
        <div>
          <Eyebrow>THE MUSIC CONTINUES</Eyebrow>
          <h2>
            Stay connected
            <br />
            <em>through music.</em>
          </h2>
        </div>
        <div className="social-list">
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
            <Instagram />
            <div>
              <strong>Instagram</strong>
              <span>Glimpses from on and off stage</span>
            </div>
            <ArrowUpRight />
          </a>
          <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
            <Youtube />
            <div>
              <strong>YouTube</strong>
              <span>Performances to come back to</span>
            </div>
            <ArrowUpRight />
          </a>
          <a href={socialLinks.spotify} target="_blank" rel="noopener noreferrer">
            <Music2 />
            <div>
              <strong>Spotify</strong>
              <span>Take the melodies with you</span>
            </div>
            <ArrowUpRight />
          </a>
        </div>
      </section>
      <BookingCTA />
      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
    </>
  );
}
