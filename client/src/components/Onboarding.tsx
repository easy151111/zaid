import { useState, useEffect } from 'react';
import { useLaunchParams, useInitData, type User } from '@telegram-apps/sdk-react';
import { useNavigate } from "react-router-dom";

import { useUserContext } from '../context/AuthContext';
import { tasks as initialTasks, type Task } from '../lib/tasks';
import Loader2 from "./Loader2"

const Onboarding = () => {
  const initData = useInitData();
  const lp = useLaunchParams();
  const { createUser, isCreatingAccount } = useUserContext();
  const start_param = lp.initData?.startParam;
  const telegramId = initData?.user.id;
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0); // Manage the onboarding steps
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timeouts = [];

    // Step 1: Show "Checking Telegram Age..."
    timeouts.push(setTimeout(() => setStep(1), 3000));

    // Step 2: Show "Verifying your Premium Status..."
    timeouts.push(setTimeout(() => setStep(2), 4000));

    // Step 3: Show "Awarding your Bonus for joining Rats Kingdom..."
    timeouts.push(setTimeout(() => setStep(3), 5000));

    // Step 4: Clear text after the third step
    timeouts.push(setTimeout(() => setStep(4), 6000));

    // Cleanup timeouts when the component unmounts
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, []);

  const handleContinue = async () => {
    try {
      if (progress === 0) {
        // Step 1: Initialize user
        setProgress(1);
        setLoading(true);

        const accountAgeTask = tasks.find(task => task.id === 1);
        const telegramPremiumTask = tasks.find(task => task.id === 2);

        if (!accountAgeTask) {
          console.error('Account Age task not found.');
          return;
        }

        function calculateCoins(accountAge) {
          const X = accountAge;
          const Y = Math.floor(Math.random() * (700 - 100 + 1)) + 100;

          const coins = (2100 * X) - (Y * X);
          return coins;
        }

        const accountAge = initData.user.accountAge || 1;
        const coins = calculateCoins(accountAge);

        let taskPoints;
        if (initData.user.isPremium) {
          taskPoints = coins + telegramPremiumTask.points;
        } else {
          taskPoints = coins;
        }

        setPoints(taskPoints);

        setTimeout(() => {
          setLoading(false);
        }, 6500);
      } else if (progress === 1) {
        setProgress(2);
      } else if (progress === 2) {
        const newUser = {
          id: telegramId,
          username: initData.user.username || 'NewUser',
          RATS: 0, // Initialize with 0 points, will update after reward claim
          frens: [],
          referralId: start_param,
          uplineBonus: Math.floor(points * 0.1), // Use Math.floor() to ensure the result is an integer
        };


        try {
          const userCreationResponse = await createUser(newUser, points);

          if (!userCreationResponse || userCreationResponse.error) {
            console.error('User creation failed:', userCreationResponse?.error || 'Unknown error');
            return;
          }

          navigate(0);
        } catch (error) {
          console.error('Error in onboarding process:', error);
        }
      }
    } catch (error) {
      console.error('Error in onboarding process:', error);
    }
  };

  return (
    <div className="w-screen h-[100dvh] flex flex-col justify-between bg-black fixed top-0 left-0 z-[1000] p-4">
      <div className="h-full flex flex-col items-center justify-center text-center">
        {progress != 1 && (
          <img 
            src="/assets/logo.png"
            alt="Rats Kingdom"
            width={170}
            height={170}
          />
        )}
        {progress === 0 && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-white">Welcome to RATS</h1>
            <p className="">
              Get rewarded for your Telegram account age and invite friends to earn more.
            </p>
          </>
        )}

        {progress === 1 && (
          <div className="h-[25rem]">
            <h1 className="text-3xl font-bold mb-4 text-white">Analysing Your Profile</h1>

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
            <h1 className="text-3xl font-bold mb-4 text-white">
              {points} RATS</h1>
            <p className="">
              You've earned {points} RATS for joining us! Welcome aboard. Earn more RATS by completing tasks and referring friends.
            </p>
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
          {isCreatingAccount ? 'Loading...' : (
            <>
              {progress === 0 ? 'Continue' : progress === 1 ? 'Claim' : 'Finish'}
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default Onboarding;