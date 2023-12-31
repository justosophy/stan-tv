import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProgramDataContext } from '../hooks/ProgramData';
import LoadingBox from '../components/LoadingBox';

const Program: React.FC = () => {
  const { program_type = '', program_id = '' } = useParams<{ program_type: string, program_id: string }>();

  const programData = useProgramDataContext();
  const program = programData.data?.find(({ type, id }) => type === program_type && id === parseInt(program_id, 10));


  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key !== "Backspace") {
        return;
      }
      e.preventDefault();
      history.back();
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <>
      <div className="program">
        {programData.loading && (
          <div className="program-image-container">
            <LoadingBox style={{ paddingTop: "148.95%", width: "500px" }} />
          </div>
        )}
        {program && (
          <div className="program-image-container">
            <img
              className="program-image"
              style={{ width: "auto", }}
              src={program.image}
            />
          </div>
        )
        }
        <div className="program-profile">
          {programData.loading && (
            <>
              <LoadingBox style={{ width: "33%" }} />
              <LoadingBox style={{ width: "66%" }} />
              <LoadingBox style={{ paddingTop: "26%" }} />
            </>
          )}
          {program && (
            <>
              <h2>{program.title}</h2>
              <ul className="program-metadata">
                <li>{program.rating}</li>
                <li>{program.year}</li>
                {program.type === "series" && (
                  // We don't have season info in data
                  <li>1 season</li>
                )}
                <li>{program.genre}</li>
                <li>{program.language}</li>
              </ul>
              <p className="program-description">{program.description}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Program;
