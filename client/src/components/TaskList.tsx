import React, { useState } from 'react';
import { Link } from "react-router-dom";

import { Task } from '../lib/tasks'; // Import Task type
import Loader2 from './Loader2';

// Define prop types
interface TaskListProps {
  tasks: Task[];
  loadingTaskId: number | null;
  onTaskAction: (task: Task) => void;
  onClaimReward: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loadingTaskId, onTaskAction, onClaimReward }) => {
  console.log('ltd:', loadingTaskId);
  return (
    <div className="p-[1rem] mt-4">
      <h1 className="text-white font-semibold text-[20px]">Tasks</h1>

      {tasks.map((task) => (
        <div key={task.id} className="mt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-[#1A1A1A] p-2 h-[2.5rem] w-[2.5rem] flex justify-center items-center">
                <img
                  src={`/assets/icons/${task.icon}.svg`}
                  alt={task.title}
                  className="w-full h-full"
                />
              </div>

              <div>
                <h1 className="text-white font-medium text-[15px]">{task.title}</h1>
                <span>+{task.points} RATS</span>
              </div>
            </div>

            <div>
              {task.status === 'incomplete' && (
                <button
                  onClick={() => onTaskAction(task)}
                  className={`rounded-full font-medium ${task.type === 'check' ? 'bg-white text-black' : 'bg-[#1A1A1A] text-white'} h-[2.5rem] flex justify-center items-center px-4`}
                  disabled={loadingTaskId === task.id} // Disable the button if this task is loading
                >
                  {loadingTaskId === task.id ? (
                    <Loader2 />
                  ) : (
                    <>
                      {task.type === 'link' ? (
                        <div
                          onClick={() => window.open(task.url, "_blank")}>
                          Start
                        </div>
                      ) : (
                        <>
                          {task.type === 'check' ? 'Check' : 'Start'}
                        </>
                      )}
                    </>
                  )}
                </button>
              )}

              {task.status === 'completed' && (
                <button
                  onClick={() => onClaimReward(task, task.points)}
                  className="rounded-full font-medium text-black bg-white p-2 px-4"
                >
                  {loadingTaskId === task.id ? (
                    <Loader2 />
                  ) : (
                    <>Claim</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;