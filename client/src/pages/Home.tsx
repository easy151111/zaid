import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useInitData, type User } from "@telegram-apps/sdk-react";
import { useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";

import getAge from "../age/idage";
import AnimatedCounter from "../components/AnimatedCounter";
import { Loader } from "../components";
import Slider from "../components/Slider";
import { Link } from "../components/Link";
import { useNotification } from "../context/NotificationContext";
import { useUserContext } from "../context/AuthContext";
import { tasks as initialTasks, type Task } from "../lib/tasks";
import { TaskList, RewardList, Onboarding } from "../components";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export interface IUser {
  _id: string;
  id: string;
  username: string;
  RATS: number;
  frens: string[];
  tasks: any[]; // Adjust the type of tasks if needed
}

export const Home: React.FC = () => {
  const notify = useNotification();
  const initData = useInitData();
  const telegramId = initData.user.id;
  const { user, claimTaskReward, isLoading, isAuthenticated, completedTasks, pageLoading } = useUserContext();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const accountAge = getAge(telegramId);
  const account = wallet ? wallet.account : null;

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [rewards, setRewards] = useState<Task[]>([]);
  const [loadingTaskId, setLoadingTaskId] = useState<number | null>(null);

  const handleClaimTask = async (task: Task, taskPoints: number) => {
    setLoadingTaskId(task.id);
    try {
      const claimReward = await claimTaskReward(task, taskPoints);

      if (!claimReward?.success) {
        notify({
          title: "Reward Claim Failed",
          message: "An error occurred while claiming the reward.",
          type: "error",
        });
        return;
      }

      notify({
        title: "Reward Claimed",
        message: "You have successfully claimed your reward!",
        type: "success",
      });

      // Remove the completed task from the tasks array after successfully claiming the reward
      setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));

      setRewards(prevRewards => [
        ...prevRewards,
        { ...task, status: "claimed" }  // Ensure the task has the "claimed" status
      ]);

    } catch (err) {
      console.error("Error claiming task reward:", err);
      notify({
        title: "Error",
        message: "An error occurred while claiming the reward.",
        type: "error",
      });
    } finally {
      setTimeout(() => {
        setLoadingTaskId(null);
      }, 1000);
    }
  };

  // Memoize handleClaimTask to prevent unnecessary re-renders
  const memoizedHandleClaimTask = useCallback(handleClaimTask, [claimTaskReward, tasks]);

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "auto";
    console.log(completedTasks);
    if (completedTasks) {
      // Filter out tasks from initialTasks if they are completedTasks with a claimed status
      const updatedTasks = initialTasks.map((task) => {
        const completedTask = completedTasks.find(
          (ct) => parseInt(ct.id) === task.id,
        );
        return completedTask ? { ...task, status: completedTask.status } : task;
      });

    // Filter initialTasks for tasks that are in completedTasks with a claimed status
    const availableRewards = initialTasks.filter(
      (task) => completedTasks.some(
        (ct) => parseInt(ct.id) === task.id && ct.status === "claimed"
      )
    );

    setTasks(updatedTasks);
    setRewards(availableRewards);
  }
}, [isLoading, completedTasks]);

  const handleTaskAction = async (task: Task) => {
    // Check if the task is already completed
    const isTaskCompleted = completedTasks.some(
      (completedTask) => completedTask.id === task.id,
    );

    if (isTaskCompleted) {
      notify({
        title: "Task Already Completed",
        message: "You have already completed this task.",
        type: "info",
      });
      return; // Terminate the process
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

      // Check task conditions if it's a 'check' type task
      if (
        task.type === "check" &&
        task.condition &&
        !task.condition(user, account)
      ) {
        notify({
          title: "Task Failed",
          message: task.failureMessage || "Task conditions not met.",
          type: "error",
        });
        return;
      }

      // Complete the task first
      await handleUpdateTaskStatus(task.id, "completed");

      if (task.id === 5) {
        notify({
          title: "Task Completed",
          message: task.successMessage || "Task completed successfully!",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error handling task action:", error);
    } finally {
      setTimeout(() => {
        setLoadingTaskId(null);
      }, 1000);
    }
  };

  // Function to handle making a TON transaction
  const makeTONTransaction = async (): Promise<boolean> => {
    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: "UQBR1dvA3qf5YrCQ0y56dAB7woyyd4wvO1iJ62X18iuaQrhC",
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

  const handleUpdateTaskStatus = async (
    taskId: number,
    status: Task["status"],
  ) => {
    try {
      const taskData = {
        telegramId,
        taskId,
        status,
      };

      const response = await axios.post(
        `${ENDPOINT}/api/v1/completeTask`,
        taskData,
      );

      if (response.data) {
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? { ...task, status } : task,
        );
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  if (!isLoading && !isAuthenticated) {
    return (
      <div className="w-full h-screen bg-black">
        <Onboarding />
      </div>
    );
  }

  if (!initData.user.username) {
    return (
      <div className="h-[100dvh] flex flex-col gap-4 items-center justify-center">
        <img src="/assets/logo.png" alt="Rats Kingdom" width={170} height={170} />
        <div className="text-center">
          <h1 className="font-bold text-white text-[22px]">Who are you?</h1>
          <span>Please set a username in Telegram to proceed.</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated && !completedTasks) return null;

  const availableTasks = tasks.filter((task) => task.status !== "claimed");

  return (
    <>
      {pageLoading ? (
        <div className="flex items-center justify-center h-[100dvh]">
          <Loader />
        </div>
      ) : (
        <>
          <div className="my-8 flex flex-col items-center text-center gap-4">
            <img
              src="/assets/logo.png"
              alt="Rats Kingdom"
              width={100}
              height={100}
            />
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
              onClaimReward={memoizedHandleClaimTask}
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
        </>
      )}

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