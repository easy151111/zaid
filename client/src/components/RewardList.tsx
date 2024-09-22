import React from 'react';
import { Task } from '../lib/tasks'; // Import Task type

// Define prop types
interface RewardListProps {
  tasks: Task[];
  premium: boolean;
  age: number; // Fix typo from 'nubmer' to 'number'
}

const RewardList: React.FC<RewardListProps> = ({ tasks, premium, age }) => {
  // Filter out task with id = 1
  const filteredTasks = tasks.filter((task) => task.id !== 1);

  return (
    <div className="p-[1rem] mt-4">
      <h1 className="text-white font-semibold text-[20px]">Your rewards</h1>

      <div className="mt-4 flex flex-col gap-4">
        {filteredTasks.map(({ id, icon, title, points }) => (
          <div key={id} className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-[#1A1A1A] p-2 h-[2.5rem] w-[2.5rem] flex justify-center items-center">
                <img
                  src={`/assets/icons/${icon}.svg`}
                  alt={title}
                  className="w-full h-full"
                />
              </div>

              <h1 className="truncate max-w-[9.5rem] text-white font-medium text-[15px]">
                {title}
              </h1>
            </div>

            <div>
              <h1 className="text-white font-medium text-[14px]">
                {/* Handle special case for task id = 2 */}
                {id === 2 && !premium ? `+0 LIONS` : `+${points} LIONS`}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardList;