import React from 'react';

import Home from "./pages/Home"
import Game from './pages/Game';

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';



function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
