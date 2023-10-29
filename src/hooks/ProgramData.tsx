import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { program } from '../types/program';

export type ProgramDataContext = {
    data: null | Array<program>,
    error: null,
    loading: boolean,
}

const ProgramDataContext = createContext<ProgramDataContext>({
    data: null,
    error: null,
    loading: false,
});

const API_URL = 'https://raw.githubusercontent.com/StreamCo/tv-coding-challenge/master/data.json';

export const ProgramDataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [programData, setProgramData] = useState({
        data: null,
        error: null,
        loading: true,
    });
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
                setProgramData({
                    data,
                    loading: false,
                    error: null,
                });
            })
            .catch(error => {
                console.error('Error during fetch:', error);
                setProgramData({
                    data: null,
                    loading: false,
                    error,
                });
            })
    }, []);

    return (
        <ProgramDataContext.Provider value={programData}>
            {children}
        </ProgramDataContext.Provider>
    );
};

export const useProgramDataContext = () => useContext(ProgramDataContext);