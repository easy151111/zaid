import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLaunchParams, useInitData } from '@telegram-apps/sdk-react';

import getAge from '../age/idage';
import { useUserContext } from '../context/AuthContext';
import { tasks as initialTasks, type Task } from '../lib/tasks';
import Loader2 from "./Loader2";

const Onboarding = () => {
  const initData = useInitData();
  const lp = useLaunchParams();
  const { createUser, isCreatingAccount } = useUserContext();
  const startParam = lp.initData?.startParam || null;
  const telegramId = initData?.user?.id || null;
  
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [step, setStep] = useState(1);

  // Helper functions
  const calculateCoins = useCallback((accountAge) => {
    const X = accountAge;
    const Y = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
    return (2100 * X) - (Y * X);
  }, []);

  const memoizedTasks = useMemo(() => initialTasks, [initialTasks]);

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setStep(1), 3000),
      setTimeout(() => setStep(2), 4000),
      setTimeout(() => setStep(3), 5000),
      setTimeout(() => setStep(4), 6000),
    ];

    // Cleanup on unmount
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const handleContinue = async () => {
    try {
      if (progress === 0) {
        setProgress(1);
        setLoading(true);

        const accountAgeTask = memoizedTasks.find(task => task.id === 1);
        const telegramPremiumTask = memoizedTasks.find(task => task.id === 2);

        if (!accountAgeTask) {
          console.error('Account Age task not found.');
          return;
        }

        const data = getAge(telegramId);
        const accountAge = data.age || 1;
        const coins = calculateCoins(accountAge);
        const taskPoints = initData.user.isPremium ? coins + telegramPremiumTask?.points : coins;

        setPoints(taskPoints);
        setLoading(false);
      } else if (progress === 1) {
        setProgress(2);
      } else if (progress === 2) {
        const newUser = {
          id: telegramId,
          username: initData.user.username || 'NewUser',
          RATS: 0,
          frens: [],
          referralId: startParam,
          uplineBonus: Math.floor(points * 0.1),
        };

        const userCreationResponse = await createUser(newUser, points);
        if (!userCreationResponse || userCreationResponse.error) {
          console.error('User creation failed:', userCreationResponse?.error || 'Unknown error');
          return;
        }

      }
    } catch (error) {
      console.error('Error in onboarding process:', error);
    }
  };

  const buttonText = useMemo(() => {
    if (progress === 0) return 'Continue';
    if (progress === 1) return 'Claim';
    return 'Finish';
  }, [progress]);

  return (
    <div className="w-screen h-[100dvh] flex flex-col justify-between bg-black fixed top-0 left-0 z-[1000] p-4">
      <div className="h-full flex flex-col items-center justify-center text-center">
        {progress !== 1 && (
          <img src="/assets/logo.png" alt="Rats Kingdom" width={170} height={170} />
        )}

        {progress === 0 && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-white">Welcome to RATS</h1>
            <p>Get rewarded for your Telegram account age and invite friends to earn more.</p>
          </>
        )}

        {progress === 1 && (
          <div className="h-[25rem]">
            <h1 className="text-3xl font-bold mb-4 text-white">Analyzing Your Profile</h1>
            <div className="flex justify-center items-center w-full h-full">
              <div className="loader"></div>
            </div>
            <div className="w-full text-center text-white space-y-2 font-bold">
              {step === 1 && <p>Checking Telegram Age...</p>}
              {step === 2 && <p>Verifying your Premium Status...</p>}
              {step === 3 && <p>Awarding your Bonus for joining Rats Kingdom...</p>}
              {step === 4 && <p>Completed</p>}
            </div>
          </div>
        )}

        {progress === 2 && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-white">{points} RATS</h1>
            <p>You've earned {points} RATS for joining us! Earn more RATS by completing tasks and referring friends.</p>
          </>
        )}
      </div>

      {loading ? (
        <div className="w-full flex justify-center items-center invert-white">
          <Loader2 />
        </div>
      ) : (
        <button
          onClick={handleContinue}
          className="mt-4 bg-white text-black w-full rounded-lg h-[3.2rem] flex items-center justify-center"
          disabled={isCreatingAccount}
        >
          {isCreatingAccount ? 'Loading...' : buttonText}
        </button>
      )}
    </div>
  );
};

export default Onboarding;