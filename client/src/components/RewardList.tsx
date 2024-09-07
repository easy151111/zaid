import React from 'react';
import { Task } from '../lib/tasks'; // Import Task type

// Define prop types
interface RewardListProps {
  tasks: Task[];
  premium: boolean;
  age: number;
}

const RewardList: React.FC<RewardListProps> = ({ tasks, premium, age }) => {
  return (
    <div className="p-[1rem] mt-4">
      <h1 className="text-white font-semibold text-[20px]">Your rewards</h1>

      <div className="mt-4 flex flex-col gap-4">
        {tasks
          .filter((task) => task.id !== 1) // Filter out tasks with id === 1
          .map((task) => (
            <div key={task.id} className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-[#1A1A1A] p-2 h-[2.5rem] w-[2.5rem] flex justify-center items-center">
                  <img 
                    src={`/assets/icons/${task.icon}.svg`}
                    alt={task.title}
                    className="w-full h-full"
                  />
                </div>

                <h1 className="truncate max-w-[9.5rem] text-white font-medium text-[15px]">
                  {task.title}
                </h1>
              </div>

              <div>
                <h1 className="text-white font-medium text-[14px]">
                  {task.id === 2 && !premium
                    ? `+0 RATS`
                    : `+${task.points} RATS`}
                </h1>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RewardList;