import React, { useEffect, useRef, useState } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

import { ProgramDataProvider } from './hooks/ProgramData';

import Root from './routes/Root';
import Home from './routes/Home';
import Program from './routes/Program';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "watch/:program_type",
                element: <Home />,
            },
            {
                path: "watch/:program_type/:program_id",
                element: <Program />,
            },
        ]
    },
    {
        path: "/watch",
        element: <Navigate to="/" replace />
    },
]);


const App: React.FC = () => {
    const [cursorGroup, setCursorGroup] = useState(() => []);

    return (
            <ProgramDataProvider>
                <RouterProvider router={router} />
            </ProgramDataProvider>
    );
}

export default App;