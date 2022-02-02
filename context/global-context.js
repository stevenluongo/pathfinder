import React, { useContext, useState, useEffect } from "react";

const GlobalContext = React.createContext();

export function useGlobalContext() {
    return useContext(GlobalContext);
}

const DEFAULT_COLORS = {start: '#956edd', finish: '#73f2b0', wall: "#003549"};


export function GlobalContextProvider({children}) {
    const [colors, setColors] = useState(DEFAULT_COLORS);
    const [loaded, setLoaded] = useState(false);
    const [speed, setSpeed] = useState(6);
    const [isAnimating, setIsAnimating] = useState(false);

    const fetchSpeed = async() => {
        const local_data = await JSON.parse(localStorage.getItem('speed'));
        if(local_data) {
            setSpeed(local_data);
            return;
        }
    }

    const fetchColors = async() => {
        const local_data = await JSON.parse(localStorage.getItem('appearance_colors'));
        if(local_data) {
            setColors(local_data)
            return;
        }
    }

    useEffect(() => {
        const loadApp = async () => {
            await fetchColors();
            await fetchSpeed();
            setLoaded(true)
        }
        loadApp();
    }, [])

    const value = {
        colors,
        setColors,
        DEFAULT_COLORS,
        loaded,
        setLoaded,
        speed,
        setSpeed,
        isAnimating,
        setIsAnimating
    }
    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    )
}