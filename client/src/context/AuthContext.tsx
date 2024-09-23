import axios from "axios";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useInitData } from '@telegram-apps/sdk-react';
import { useGetUser, useGetLeaderboard, useGetUserFrens } from "../lib/actions";

const ENDPOINT = https://rat-server.vercel.app;

export type IUser = {
  _id: string;
  id: string;
  username: string;
  LIONS: number;
  frens: string[];
  tasks: [];
  uplineBonus: number;
};

export const INITIAL_USER: IUser = {
  _id: "",
  id: "",
  username: "",
  LIONS: 0,
  frens: [],
  tasks: [],
  uplineBonus: 0,
};

const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  currentUser: INITIAL_USER,
  isLoading: true,
  isCreatingAccount: false, // Added isCreatingAccount state
  setUser: () => {},
  checkAuthUser: async () => false as boolean,
  createUser: async () => {},
  claimTaskReward: async () => {},
};

type IContextType = {
  user: IUser;
  currentUser: IUser;
  isLoading: boolean;
  isCreatingAccount: boolean; // Loading state for account creation
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  checkAuthUser: () => Promise<boolean>;
  createUser: (user: IUser, points: number) => Promise<boolean>;
  claimTaskReward: (taskId: number) => Promise<{ success: boolean; newPoints?: number }>;
  frens: any[];
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false); // Added for account creation loading state

  const initData = useInitData();
  const telegramId = initData.user.id;

  const { data: currentUser, isPending: isCheckingCurrentUser } = useGetUser(telegramId.toString() || "");
  const { data: leaderboard } = useGetLeaderboard(user?.id);
  const { data: frens } = useGetUserFrens(user?.id || "");

  useEffect(() => {
    if (!isCheckingCurrentUser && currentUser) {
      setUser(currentUser);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isCheckingCurrentUser, currentUser]);

  const createUser = useCallback(async (newUser: IUser, points: number): Promise<boolean> => {
    setIsCreatingAccount(true); // Start loading state
    try {
      const response = await axios.post(`${ENDPOINT}/api/v1/createUser`, newUser);

      if (response.data) {
        const createdUser = response.data;

        const completeAgeTask = await axios.post(`${ENDPOINT}/api/v1/completeTask`, {
          telegramId,
          taskId: 1,
          status: 'completed',
        });

        const completePremiumTask = await axios.post(`${ENDPOINT}/api/v1/completeTask`, {
          telegramId,
          taskId: 2,
          status: 'completed',
        });

        if (completeAgeTask?.error || completePremiumTask?.error) {
          console.error('Task completion failed:', completeAgeTask?.error || completePremiumTask?.error);
          return false;
        }

        const claimAgeReward = await axios.post(`${ENDPOINT}/api/v1/claimRewards`, {
          newPoints: points,
          telegramId,
          taskId: 1,
          status: 'claimed',
        });

        const claimPremiumReward = await axios.post(`${ENDPOINT}/api/v1/claimRewards`, {
          newPoints: points,
          telegramId,
          taskId: 2,
          status: 'claimed',
        });

        if (claimAgeReward?.error || claimPremiumReward?.error) {
          console.error('Reward claim failed:', claimAgeReward?.error || claimPremiumReward?.error);
          return false;
        }

        setUser({
          _id: createdUser._id,
          id: createdUser.id,
          username: createdUser.username,
          LIONS: Number(points),
          frens: createdUser.frens,
          tasks: createdUser.tasks,
          uplineBonus: createdUser.uplineBonus || 0,
        });

        return true;
      }
      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.status, error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      return false;
    } finally {
      setIsCreatingAccount(false); // Stop loading state
    }
  }, [telegramId]);

  const claimTaskReward = useCallback(async (task: any, taskPoints: number): Promise<{ success: boolean; newPoints?: number }> => {
    try {
      const newPoints = user?.LIONS + taskPoints;
      const claimRewardResponse = await axios.post(`${ENDPOINT}/api/v1/claimRewards`, {
        newPoints,
        telegramId,
        taskId: task.id,
        status: "claimed",
      });

      if (claimRewardResponse?.error) {
        console.error("Error claiming task reward:", claimRewardResponse.error);
        return { success: false, error: claimRewardResponse.error };
      }

      setUser((prevUser) => ({
        ...prevUser,
        LIONS: newPoints,
      }));

      return { success: true, newPoints };
    } catch (error) {
      console.error("Error claiming task reward:", error);
      return { success: false, error };
    }
  }, [user, telegramId]);

  const value = {
    user,
    setUser,
    currentUser,
    leaderboard,
    frens,
    isLoading,
    isCreatingAccount, // Pass isCreatingAccount to the context
    createUser,
    claimTaskReward,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
