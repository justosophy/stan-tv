import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useProgramDataContext } from '../hooks/ProgramData';
import Carousel from '../components/Carousel';

const Home: React.FC = () => {
  const { program_type } = useParams<{ program_type: string | undefined }>();
  const programData = useProgramDataContext();

  const carouselItems =
    (program_type
      ? programData?.filter(({ type }) => type === program_type)
      : programData)?.map(
        ({ id, image, title, type }) => ({ id, image, title, to: `/watch/${type}/${id}` })
      );

  let defaultStarting1 = null;
  let defaultCursor1 = null;
  if (carouselItems && history.state?.carousel?.id === 'carousel-1') {
    defaultStarting1 = history.state?.carousel?.starting;
    defaultCursor1 = history.state?.carousel?.cursor;
  }

  return (
    <>
      <Carousel
        defaultStarting={defaultStarting1}
        defaultCursor={defaultCursor1}
        id="carousel1"
        items={carouselItems ?? []}
        loading={!programData}
        onChange={(carousel) => {
          history.replaceState({ carousel }, document.title);
        }}
      />
      <Carousel
        defaultStarting={carouselItems ? 0 : null}
        defaultCursor={null}
        id="carousel2"
        items={carouselItems ?? []}
        loading={!programData}
      />
      <Carousel
        defaultStarting={carouselItems ? 0 : null}
        defaultCursor={null}
        id="carousel3"
        items={carouselItems ?? []}
        loading={!programData}
      />
    </>
  );
};

export default Home;
