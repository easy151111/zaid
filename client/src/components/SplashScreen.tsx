import { motion } from 'framer-motion';

const SplashScreen = () => {
  
  return (
    <div className="z-[1000] fixed top-0 left-0 w-screen h-[100dvh] flex flex-col items-center text-center justify-center bg-black">
      <div>
        <motion.img 
          src="/assets/logo.png" 
          alt="Splash-Screen" 
          className="w-[10rem] h-[10rem]" 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1, 1, 1], opacity: 1 }}
          transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse" }}
        className="font-black text-[30px] text-white">
        HAMSTERS
      </motion.h1>
    </div>
  );
};

export default SplashScreen;