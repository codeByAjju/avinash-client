import { PageIntro, Eyebrow, Picture, Button } from '../components/common/UI';
import { ArtistIntro } from './Home';
import { BookingCTA } from '../components/layout/Layout';
import { socialLinks } from '../utils/site';
export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="AVINASH GUPTA / THE ARTIST"
        title={
          <>
            The story behind
            <br />
            <em>the music.</em>
          </>
        }
      >
        A musical world shaped by familiar melodies and the feelings they leave behind.
      </PageIntro>
      <ArtistIntro full />
      <section className="editorial-band">
        <div className="container editorial-two">
          <div>
            <Eyebrow>MELODY. MEMORY. CONNECTION.</Eyebrow>
            <h2>
              A song can take
              <br />
              you <em>somewhere.</em>
            </h2>
          </div>
          <div>
            <p>
              There is something about a familiar song. It takes you back to a place, a person, a
              moment you thought you had forgotten.
            </p>
            <p>
              That connection runs through this collection of performances: the romance of Hindi
              film melodies, the devotion of a timeless chant, and the warmth of voices coming
              together at a concert.
            </p>
            <p>
              Explore the renditions and live performances on Avinash’s official channel, and
              discover the music in your own way.
            </p>
            <Button href={socialLinks.youtube} variant="outline">
              Explore official performances
            </Button>
          </div>
        </div>
      </section>
      <section className="about-image container">
        <Picture
          src="/images/DSC00871.jpeg"
          alt="The view from the stage as Avinash Gupta performs to an audience illuminated by phone lights"
          width={2000}
          height={1333}
        />
        <span className="photo-caption">THE STAGE / WHERE MELODIES BECOME SHARED MEMORIES</span>
      </section>
      <BookingCTA />
    </>
  );
}
