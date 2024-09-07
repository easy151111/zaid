import User from '../mongodb/models/user.model.js';
import Task from '../mongodb/models/task.model.js';


// Get Leaderboard Details
export const getLeaderboard = async (req, res) => {
  try {
    const userId = req.query.userId;
    
    // Fetch top 100 users sorted by RATS
    const topUsers = await User.find({}, { username: 1, RATS: 1 })
      .sort({ RATS: -1 })
      .limit(50);

    let userPosition = null;
    let user = null;

    // Check if the user is not in the top 100
    if (userId) {
      user = await User.findOne({ id: userId }, { username: 1, RATS: 1 });
      if (user) {
        const higherUsersCount = await User.countDocuments({ RATS: { $gt: user.RATS } });
        userPosition = higherUsersCount + 1; // The user's position in the entire leaderboard
      }
    }

    const totalUsers = await User.countDocuments();
    
    res.status(200).json({
      users: topUsers,
      totalUsers,
      userPosition: userPosition || null, // Only include user position if it's outside the top 100
      user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get all users
// export const getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// };

// Create a new user
export const createUser = async (req, res) => {
  const { id, username, RATS, referralId, uplineBonus } = req.body;
  
  try {
    // Validate input data
    if (!id || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create the new user first
    const newUser = new User({
      id,
      username,
      RATS,
      frens: [],
      uplineBonus, // Initialize with 0; it will be updated if a referral is found
    });

    // If there's a referralId, find the referring user
    if (referralId) {
      const referringUser = await User.findOne({ _id: referralId });

      if (referringUser) {
        // Add the new user to the referrer's frens array
        referringUser.frens.push(newUser._id);

        // Calculate 10% of the new user's RATS points
        const bonusPoints = uplineBonus;

        // Add bonus points to the referring user's RATS points
        referringUser.RATS += bonusPoints;

        // Assign the same bonus to the new user's uplineBonus field
        newUser.uplineBonus = bonusPoints;

        await referringUser.save();
      } else {
        console.log('Referring user not found. Proceeding without referral bonuses.');
        // Optionally, you can add more logic here if needed
      }
    }

    // Save the new user to the database
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Get a user by ID
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ id });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// function to add completed task for a user
export const completeTask = async (req, res) => {
  const { telegramId, taskId, status } = req.body;

  try {
    // Validate input data
    if (!taskId || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find the user
    const user = await User.findOne({ id: telegramId }).populate('tasks');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the task already exists in the user's task list
    const existingTask = user.tasks.find(task => task.id === taskId);

    if (existingTask) {
      // Prevent updating if the task is already completed
      if (existingTask.status === 'completed' || existingTask.status === 'claimed') {
        return res.status(400).json({ error: 'Task has already been completed or claimed' });
      }

      // Update the status to completed
      if (status === 'completed') {
        existingTask.status = 'completed';
        await existingTask.save();
        return res.status(200).json({ message: 'Task status updated to completed', task: existingTask });
      }
    } else {
      // If the task does not exist, create a new one
      const addTask = new Task({
        id: taskId,
        status: status,
      });

      // Save the task to the database
      await addTask.save();

      // Add the task ID to the user's task list
      user.tasks.push(addTask._id);
      await user.save();

      return res.status(201).json({ message: 'Task created and assigned to user successfully', task: addTask });
    }
  } catch (error) {
    console.error('Error creating or updating task:', error);
    res.status(500).json({ error: 'Failed to create or update task' });
  }
};

// get a user's completed task
export const getUserTasks = async (req, res) => {
  const { telegramId } = req.params;

  try {
    // Find the user and populate their tasks
    const user = await User.findOne({ id: telegramId }).populate('tasks');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Filter tasks by completed or claimed status
    const Tasks = user.tasks;

    res.status(200).json(Tasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// get a user's freind list
export const getUserFrens = async (req, res) => {
  const { telegramId } = req.params;

  try {
    // Find the user and populate their tasks
    const user = await User.findOne({ id: telegramId }).populate('frens');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Filter tasks by completed or claimed status
    const Frens = user.frens;

    res.status(200).json(Frens);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// claim rewards
export const claimRewards = async (req, res) => {
  const { newPoints, telegramId, taskId, status } = req.body;

  // Log to check if the value is passed correctly
  // console.log('Received newPoints:', newPoints);

  const id = telegramId;
  const RATS = newPoints || 0; // Fallback to 0 if newPoints is null or undefined

  try {
    // Validate input data
    if (!id || newPoints === undefined || !taskId || !status) {
      return res.status(400).json({ error: 'User ID, RATS, taskId, and status are required' });
    }

    // Find the user by ID
    const user = await User.findOne({ id }).populate('tasks');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the task and check if it's already claimed
    const task = user.tasks.find(task => task.id === taskId.toString());
    if (task) {
      if (task.status === 'claimed') {
        return res.status(400).json({ error: 'Reward for this task has already been claimed' });
      }

      // Update the task status to claimed
      task.status = status;
      await task.save(); // Save the task with updated task status

      // Update the user's RATS value in the database
      user.RATS = RATS;
      await user.save(); // Save the user with updated RATS

      res.status(200).json({ message: 'RATS and task status updated successfully', user });
    } else {
      return res.status(404).json({ error: `Task with ID ${taskId} not found` });
    }
  } catch (error) {
    console.error('Error updating RATS and task status:', error.message || error);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
  }
};
