import { useState } from 'react';
import { PageIntro, DataState, Pagination } from '../components/common/UI';
import GalleryGrid from '../components/gallery/GalleryGrid';
import useApi from '../hooks/useApi';
export default function Gallery() {
  const [page, setPage] = useState(1);
  const state = useApi(`/gallery?limit=24&page=${page}`);
  return (
    <>
      <PageIntro
        eyebrow="THROUGH THE LENS"
        title={
          <>
            Between
            <br />
            <em>the notes.</em>
          </>
        }
      >
        The energy of a stage. The quiet in between. A few moments, held still.
      </PageIntro>
      <section className="container catalogue-section">
        <DataState state={state} empty="The next frame is on its way.">
          <GalleryGrid images={state.data} />
        </DataState>
        <Pagination page={page} meta={state.meta} onChange={setPage} />
      </section>
    </>
  );
}
