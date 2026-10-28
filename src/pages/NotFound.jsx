import { Button, PageIntro } from '../components/common/UI';
export default function NotFound() {
  return (
    <section className="not-found">
      <PageIntro
        eyebrow="404 / A NOTE OUT OF PLACE"
        title={
          <>
            Let’s find
            <br />
            <em>our way back.</em>
          </>
        }
      >
        The page you’re looking for isn’t here. There’s still plenty of music to discover.
      </PageIntro>
      <Button to="/">Back to the music</Button>
    </section>
  );
}
