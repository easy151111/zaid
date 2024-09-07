import { Routes, Route } from "react-router-dom";
import { type FC, useState, useEffect, useMemo } from 'react';

import { Topbar } from "./components"
import SplashScreen from './components/SplashScreen';
import { Home } from './pages/Home'
import { Leaderboard } from "./pages/Leaderboard";
import { Frens } from "./pages/Frens";

import { useUserContext } from "./context/AuthContext";

import './globals.css';

export const App: FC = () => {
  const { isLoading } = useUserContext();


  
  return (
    <>
      {isLoading && (
        <section className="fixed top w-screen h-screen bg-black z-[900]">
          <SplashScreen  />
        </section>
      )}
      <Topbar />
      <Routes>
        <Route path='*' element={<Home />}/>
        <Route path='/leaderboard' element={<Leaderboard />}/>
        <Route path='/frens' element={<Frens />}/>
      </Routes>
    </>
  );
};