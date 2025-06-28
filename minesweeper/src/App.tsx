import React from 'react';

import Home from "./pages/Home"
import GameManagerWrapper from './pages/GameManager';

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';



function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/game/:path" element={<GameManagerWrapper />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
