import { Routes, Route } from "react-router-dom";
import { type FC, useState, useEffect, useMemo } from 'react';
<<<<<<< HEAD

import { Topbar } from "./components"
import SplashScreen from './components/SplashScreen';
import { Home } from './pages/Home'
import { Leaderboard } from "./pages/Leaderboard";
import { Frens } from "./pages/Frens";
=======

import { Topbar } from "./components"
import SplashScreen from './components/SplashScreen';
import { Home } from './pages/Home'
import { Leaderboard } from "./pages/Leaderboard";
import { Frens } from "./pages/Frens";

import { useUserContext } from "./context/AuthContext";
>>>>>>> 2555042 (Update)

import './globals.css';

export const App: FC = () => {
<<<<<<< HEAD
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const handleLoaded = () => {
      setLoading(false);
    };

    setTimeout(handleLoaded, 3000);
  }, [])
=======
  const { isLoading } = useUserContext();

>>>>>>> 2555042 (Update)

  
  return (
    <>
<<<<<<< HEAD
      {loading && (
=======
      {isLoading && (
>>>>>>> 2555042 (Update)
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