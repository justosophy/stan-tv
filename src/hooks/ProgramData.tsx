import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { program } from '../types';

const ProgramDataContext = createContext<null | Array<program>>(null);

const API_URL = 'https://raw.githubusercontent.com/StreamCo/tv-coding-challenge/master/data.json';

export const ProgramDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [programData, setProgramData] = useState(null);
    const fetchSent = useRef(false);
    useEffect(() => {
        if (fetchSent.current) {
            return;
        }
        fetchSent.current = true;

        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                setProgramData(data);
            })
            .catch(error => {
                console.error('Error during fetch:', error);
            })
    }, []);

    return (
        <ProgramDataContext.Provider value={programData}>
            {children}
        </ProgramDataContext.Provider>
    );
};

export const useProgramDataContext = () => useContext(ProgramDataContext);