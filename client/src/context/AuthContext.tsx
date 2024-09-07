import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useInitData } from '@telegram-apps/sdk-react';

import { useGetUser, useGetLeaderboard, useGetUserFrens, useGetCompletedTasks } from "../lib/actions";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export type IUser = {
  _id: string;
  id: string;
  chatId: string;
  username: string;
  RATS: number;
  frens: string[];
  tasks: [];
  uplineBonus: number;
};

export const INITIAL_USER: IUser = {
  _id: "",
  id: "",
  chatId: "",
  username: "",
  RATS: 0,
  frens: [],
  tasks: [],
  uplineBonus: 0,  // Missing field added
};

const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  currentUser: INITIAL_USER,  // Added `currentUser` to the initial state
  isLoading: true,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  setUser: () => {},
  checkAuthUser: async () => false as boolean,
  createUser: async () => {},
  claimTaskReward: async () => {},
};

type IContextType = {
  user: IUser;
  currentUser: IUser;
  isLoading: boolean;
  isCreatingAccount: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  createUser: (user: IUser) => Promise<void>;
  claimTaskReward: (taskId: number) => Promise<void>;
  frens: any[];
  completedTasks: any[];
  pageLoading: boolean;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const initData = useInitData();
  const telegramId = initData.user.id;

  const { data: currentUser, isPending: isCheckingCurrentUser } = useGetUser(telegramId.toString() || "");
  const { data: leaderboard } = useGetLeaderboard(user?.id);
  const { data: frens } = useGetUserFrens(user?.id || "");
  const { data: completedTasks, isPending: pageLoading } = useGetCompletedTasks(user?.id);

  useEffect(() => {
    if (!isCheckingCurrentUser && currentUser) {
      setUser(currentUser);
      if (currentUser.username) {
         setIsAuthenticated(true);
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [isCheckingCurrentUser, currentUser?.username]);

  const createUser = async (newUser: IUser, points: number) => {
    setIsCreatingAccount(true);
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

        if (
          (!completeAgeTask && !completePremiumTask) || 
          completeAgeTask?.error || 
          completePremiumTask?.error
        ) {
          console.error('Task completion failed:', completeAgeTask?.error || completePremiumTask?.error || 'Unknown error');
          return;
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

        if (claimAgeReward.error || claimPremiumReward.error) {
          console.error('Reward claim failed:', claimAgeReward.error || claimPremiumReward.error || 'Unknown error');
          return;
        }

        console.log('User created successfully:', createdUser);
        setUser({
          _id: createdUser._id,
          id: createdUser.id,
          chatId: createdUser.chatId,
          username: createdUser.username,
          RATS: Number(createdUser.RATS),
          frens: createdUser.frens,
          tasks: createdUser.tasks,
          uplineBonus: createdUser.uplineBonus || 0, // Include uplineBonus
        });

        // Update user points after successful reward claim
        setUser({
          ...user, // Spread the existing user data
          RATS: Number(points),
        });
        
        return true;
      }

      return false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.status, error.message);
        console.error('Response data:', error.response?.data);
  
      } else {
        console.error('Unexpected error:', error);
      }
      return false;
    }
  };

  const claimTaskReward = async (task: any, taskPoints: number) => {
    try {
      const newPoints = user?.RATS + taskPoints;
      const claimRewardResponse = await axios.post(
        `${ENDPOINT}/api/v1/claimRewards`,
        {
          newPoints,
          telegramId,
          taskId: task.id,
          status: "claimed",
        }
      );

      if (!claimRewardResponse || claimRewardResponse.error) {
        console.error(
          "Error claiming task reward:",
          claimRewardResponse?.error || "Unknown error"
        );
        return { success: false, error: claimRewardResponse?.error };
      }

      // Update user points after successful reward claim
      setUser({
        ...user, // Spread the existing user data
        RATS: Number(newPoints),
      });

      return { success: true, newPoints }; // Return success and new points
    } catch (error) {
      console.error("Error claiming task reward:", error);
      return { success: false, error };
    }
  };

  const value = {
    user,
    setUser,
    currentUser,
    completedTasks,
    leaderboard,
    frens,
    isLoading,
    isCreatingAccount,
    isAuthenticated,
    createUser,
    claimTaskReward,
    pageLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
