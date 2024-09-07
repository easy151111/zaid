import {
  useQuery, 
} from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export type IUser = {
  _id: string;
  id: string;
  username: string;
  RATS: number;
  frens: string[];
  tasks: [];
  uplineBonus: number;
};

export const getUser = async (userId: string) => {
  try {
    const response = await fetch(`${ENDPOINT}/api/v1/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

const getUserFrens = async (userId: string) => {
  try {
    const response = await fetch(`${ENDPOINT}/api/v1/userFrens/${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching frens:', error);
  }
};

export const getCompletedTasks = async (telegramId: string) => {
  try {
    const response = await fetch(`${ENDPOINT}/api/v1/userTasks/${telegramId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching completed tasks:', error);
  }
};

export const getLeaderboard = async (userId: string) => {
  try {
    const response = await fetch(`${ENDPOINT}/api/v1/getLeaderboard?userId=${userId}`);

    if (!response.ok) throw new Error('Failed to fetch leaderboard data');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error; // Rethrow the error to be caught by react-query
  }
}

export const useGetLeaderboard = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_LEADERBOARD, userId],
    queryFn: () => getLeaderboard(userId),
    enabled: !!userId,
  });
};

export const useGetCompletedTasks = (telegramId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMPLETED_TASKS, telegramId],
    queryFn: () => getCompletedTasks(telegramId),
    enabled: !!telegramId,
  });
};

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER, userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  });
};

export const useGetUserFrens = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_FRENS, userId],
    queryFn: () => getUserFrens(userId),
    enabled: !!userId,
  });
};