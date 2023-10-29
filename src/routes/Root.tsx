import React, { useEffect } from 'react';
import { Outlet, NavLink, useLocation, useParams } from "react-router-dom";
import '../styles.css';
import logo from '../logo.svg';

import { useProgramDataContext } from '../hooks/ProgramData';
import { setInitialPageFocus, useFocusGroupControls } from '../hooks/FocusGroups';


const Root: React.FC = () => {
  const location = useLocation();
  const { program_id = '' } = useParams<{ program_id: string }>();
  const programData = useProgramDataContext();

  useEffect(() => {
    if (
      (programData
        || document.activeElement === null
        || document.activeElement === document.body
      ) && !program_id
    ) {
      requestAnimationFrame(() => { })
      setInitialPageFocus()
    }
  }, [location, programData.data]);

  useFocusGroupControls();

  return (
    <div className="app">

      <div className="focus-groups">
        <nav data-focusgroup="nav">
          <img src={logo} alt="Logo" style={{ width: "290px" }} />
          <div className="nav-items">
            <NavLink to="/" data-itemindex="0">Home</NavLink>
            <NavLink to="/watch/series" data-itemindex="1">TV Shows</NavLink>
            <NavLink to="/watch/movie" data-itemindex="2">Movies</NavLink>
          </div>
        </nav>
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
