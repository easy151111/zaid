import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useInitData } from "@telegram-apps/sdk-react";
import { useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";
import getAge from "../age/idage";
import AnimatedCounter from "../components/AnimatedCounter";
import { Loader, Slider, TaskList, RewardList, Onboarding, Link } from "../components";
import { useNotification } from "../context/NotificationContext";
import { useUserContext } from "../context/AuthContext";
import { useGetCompletedTasks } from "../lib/actions";
import { tasks as initialTasks, type Task } from "../lib/tasks";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export interface IUser {
  _id: string;
  id: string;
  username: string;
  RATS: number;
  frens: string[];
  tasks: any[];
}

export const Home: React.FC = () => {
  const notify = useNotification();
  const { user, claimTaskReward, isLoading, isCreatingAccount } = useUserContext();
  const initData = useInitData();
  const telegramId = initData.user.id.toString();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const accountAge = getAge(telegramId);
  
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);

  const { data: completedTasks, isPending: pageLoading } = useGetCompletedTasks(telegramId);
  const account = wallet ? wallet.account : null;

  // Memoize tasks to prevent unnecessary re-renders
  const availableTasks = useMemo(() => tasks.filter(task => task.status !== "claimed"), [tasks]);
  const rewards = useMemo(() => tasks.filter(task => task.status === "claimed"), [tasks]);

  // Centralized task status update
  const updateTaskStatus = useCallback(async (taskId: number, status: Task["status"]) => {
    try {
      const response = await axios.post(`${ENDPOINT}/api/v1/completeTask`, {
        telegramId,
        taskId,
        status,
      });
      if (response.data) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? { ...task, status } : task))
        );
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  }, [telegramId]);

  // Claim task reward and handle task update
  const handleClaimTask = useCallback(async (task: Task, taskPoints: number) => {
    try {
      const { success, error, newPoints } = await claimTaskReward(task, taskPoints);
      if (!success) {
        notify({ title: "Reward Claim Failed", message: error || "An error occurred.", type: "error" });
        return;
      }

      notify({ title: "Reward Claimed", message: "You successfully claimed your reward!", type: "success" });
      setTasks((prevTasks) => prevTasks.map((t) => (t.id === task.id ? { ...t, status: "claimed" } : t)));
    } catch (err) {
      console.error("Error claiming task reward:", err);
      notify({ title: "Error", message: "An error occurred while claiming the reward.", type: "error" });
    }
  }, [claimTaskReward, notify]);

  // Handle task actions and conditions
  const handleTaskAction = useCallback(
    async (task: Task) => {
      if (completedTasks?.some((completedTask) => completedTask.id === task.id)) {
        notify({ title: "Task Already Completed", message: "You've already completed this task.", type: "info" });
        return;
      }

      setLoadingTaskId(task.id);
      try {
        // If the task is "Make a TON Transaction"
        if (task.id === 5 && task.type === "start") {
          if (!account) {
            notify({
              title: "Transaction Failed",
              message: "Please connect your wallet to attempt this task.",
              type: "error",
            });
            return;
          }

          // Start the transaction process
          const transactionSuccess = await makeTONTransaction(); // Call the function to make the TON transaction

          if (!transactionSuccess) {
            return; // Do not proceed if the transaction fails
          }
        }
        

        if (task.type === "check" && task.condition && !task.condition(user, account)) {
          notify({ title: "Task Failed", message: task.failureMessage || "Task conditions not met.", type: "error" });
          return;
        }

        await updateTaskStatus(task.id, "completed");
        notify({ title: "Task Completed", message: task.successMessage || "Task completed!", type: "success" });
      } catch (error) {
        console.error("Error handling task action:", error);
      } finally {
        setLoadingTaskId(null);
      }
    },
    [completedTasks, account, user, notify, updateTaskStatus]
  );

  // Function to handle making a TON transaction
  const makeTONTransaction = async (): Promise<boolean> => {
    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: "UQA4TUbJFuexHJkzmJf2wcofyMIhSwYUikoO5WKde4ctJcVq",
            amount: "200000000",
          },
        ],
      };

      // Send the transaction
      const result = await tonConnectUI.sendTransaction(transaction);

      // Verify if the transaction was successful
      if (result) {
        return true; // Transaction was successful
      } else {
        return false; // Transaction failed
      }
    } catch (error) {
      console.error("Error making TON transaction:", error);
      return false; // Return false if there's an error
    }
  };
  

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "auto";
    if (completedTasks) {
      const updatedTasks = initialTasks.map((task) => {
        const completedTask = completedTasks.find((ct) => parseInt(ct.id) === task.id);
        return completedTask ? { ...task, status: completedTask.status } : task;
      });
      setTasks(updatedTasks);
    }
  }, [isLoading, completedTasks, isCreatingAccount]);

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-[100dvh]">
        <Loader />
      </div>
    );
  }

  if (!initData.user.username) {
    return (
      <div className="h-[100dvh] flex flex-col gap-4 items-center justify-center">
        <img src="/assets/logo.png" alt="HAMSTERS" width={170} height={170} />
        <div className="text-center">
          <h1 className="font-bold text-white text-[22px]">Who are you?</h1>
          <span>Please set a username in Telegram to proceed.</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="my-8 flex flex-col items-center text-center gap-4">
        <img src="/assets/logo.png" alt="HAMSTERS" width={100} height={100} />
        <div className="leading-none font-bold text-white text-[30px]">
          <AnimatedCounter from={0} to={user?.RATS || 0} />
          <h2 className="text-white/50 text-[24px]">RATS</h2>
        </div>
      </div>

      <Slider />

      {availableTasks.length > 0 && (
        <TaskList
          tasks={availableTasks}
          onTaskAction={handleTaskAction}
          onClaimReward={handleClaimTask}
          loadingTaskId={loadingTaskId}
        />
      )}

      {rewards.length > 0 && (
        <RewardList
          tasks={rewards}
          premium={initData.user.isPremium}
          age={accountAge.age}
        />
      )}

      <div className="flex justify-center items-center h-[4rem] w-full font-semibold text-md mt-4 mb-[5rem]">
        Privacy Policy
      </div>

      <div className="fixed bottom-0 w-full h-[4rem] p-4 flex items-center justify-between bg-black rounded-t-lg">
        <Link
          to="/"
          className={`w-full flex flex-col text-[12px] items-center gap-[2px] ${location.pathname === "/" ? "invert-white text-white font-bold" : ""}`}
        >
          <img
            src="/assets/icons/home.svg"
            alt="home"
            className="w-[1.5rem] h-[1.5rem]"
          />
          Home
        </Link>

        <Link
          to="/leaderboard"
          className={`w-full flex flex-col text-[12px] items-center gap-[2px] ${location.pathname === "/leaderboard" ? "invert-white text-white font-bold" : ""}`}
        >
          <img
            src="/assets/icons/leaderboard.svg"
            alt="Leaderboard"
            className="w-[1.5rem] h-[1.5rem]"
          />
          Leaderboard
        </Link>

        <Link
          to="/frens"
          className={`w-full flex flex-col text-[12px] items-center gap-[2px] ${location.pathname === "/frens" ? "invert-white text-white font-bold" : ""}`}
        >
          <img
            src="/assets/icons/frens.svg"
            alt="Frens"
            className="w-[1.5rem] h-[1.5rem]"
          />
          Frens
        </Link>
      </div>
    </>
  );
};