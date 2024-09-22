import React, { useMemo, useCallback } from 'react';
import { Task } from '../lib/tasks'; // Import Task type
import Loader2 from './Loader2';

// Define prop types
interface TaskListProps {
  tasks: Task[];
  loadingTaskId: number | null;
  onTaskAction: (task: Task) => void;
  onClaimReward: (task: Task, taskPoints: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loadingTaskId, onTaskAction, onClaimReward }) => {
  // Memoize the tasks to avoid recalculations on each render
  const memoizedTasks = useMemo(() => tasks, [tasks]);

  // Use callbacks to prevent re-creation of functions on each render
  const handleTaskAction = useCallback((task: Task) => () => onTaskAction(task), [onTaskAction]);

  const handleClaimReward = useCallback((task: Task) => () => onClaimReward(task, task.points), [onClaimReward]);

  // Handle tasks of type 'link': first claim the task, then open the link
  const handleLinkTask = useCallback(
    (task: Task) => async () => {
      // Claim the task first
      onTaskAction(task);

      // Once the task action is completed, open the link
      window.open(task.url, '_blank');
    },
    [onTaskAction]
  );

  return (
    <div className="p-[1rem] mt-4">
      <h1 className="text-white font-semibold text-[20px]">Tasks</h1>

      {memoizedTasks.map((task) => (
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
                <span>+{task.points} LIONS</span>
              </div>
            </div>

            <div>
              {task.status === 'incomplete' && task.type !== 'link' && (
                <button
                  onClick={handleTaskAction(task)}
                  className={`rounded-full font-medium ${
                    task.type === 'check' ? 'bg-white text-black' : 'bg-[#1A1A1A] text-white'
                  } h-[2.5rem] flex justify-center items-center px-4`}
                  disabled={loadingTaskId === task.id} // Disable the button if this task is loading
                >
                  {loadingTaskId === task.id ? <Loader2 /> : task.type === 'check' ? 'Check' : 'Start'}
                </button>
              )}

              {task.status === 'incomplete' && task.type === 'link' && (
                <button
                  onClick={handleLinkTask(task)}
                  className="rounded-full font-medium bg-[#1A1A1A] text-white h-[2.5rem] flex justify-center items-center px-4"
                  disabled={loadingTaskId === task.id}
                >
                  {loadingTaskId === task.id ? <Loader2 /> : 'Start'}
                </button>
              )}

              {task.status === 'completed' && (
                <button
                  onClick={handleClaimReward(task)}
                  className="rounded-full font-medium text-black bg-white p-2 px-4"
                >
                  Claim
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(TaskList);