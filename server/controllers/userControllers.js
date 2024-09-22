import User from '../mongodb/models/user.model.js';
import Task from '../mongodb/models/task.model.js';

// Helper function to handle errors
const handleError = (res, message, code = 500) => {
  res.status(code).json({ error: message });
};

// Get Leaderboard Details
export const getLeaderboard = async (req, res) => {
  try {
    const { userId } = req.query;

    // Fetch top 100 users sorted by LIONS, projecting only required fields
    const topUsers = await User.find({}, { username: 1, LIONS: 1 })
      .sort({ LIONS: -1 })
      .limit(100);

    let userPosition = null;
    let user = null;

    // Check if the user is outside the top 100
    if (userId) {
      user = await User.findOne({ id: userId }, { username: 1, LIONS: 1 });
      if (user) {
        const higherUsersCount = await User.countDocuments({ LIONS: { $gt: user.LIONS } });
        userPosition = higherUsersCount + 1;
      }
    }

    const totalUsers = await User.estimatedDocumentCount();

    res.status(200).json({
      users: topUsers,
      totalUsers,
      userPosition: userPosition || null,
      user,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    handleError(res, 'Failed to fetch leaderboard');
  }
};

// Create a new user
export const createUser = async (req, res) => {
  const { id, username, LIONS, referralId, uplineBonus } = req.body;

  try {
    // Validate input data
    if (!id || !username) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if the user already exists before proceeding
    const existingUser = await User.findOne({ id });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // If the user doesn't exist, create a new user with upsert (atomic operation)
    const newUser = await User.create({
      id,
      username,
      LIONS: LIONS || 0, // Default LIONS to 0 if not provided
      frens: [],
      uplineBonus: 0,
    });

    // If there's a referralId, handle referral logic but ensure it runs only once
    if (referralId && uplineBonus) {
      const referringUser = await User.findOne({ _id: referralId });

      if (referringUser) {
        // Check if referral bonus has already been applied to avoid duplicate bonuses
        if (!referringUser.frens.includes(newUser._id)) {
          referringUser.frens.push(newUser._id);
          referringUser.LIONS += uplineBonus;
          newUser.uplineBonus = uplineBonus;

          // Save both referringUser and newUser in parallel (to save time)
          await Promise.all([referringUser.save(), newUser.save()]);
        } else {
          console.log('Referral bonus already applied for this user.');
        }
      } else {
        console.log('Referring user not found. Proceeding without referral bonuses.');
      }
    }

    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Duplicate key error: User already exists' });
    } else {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
};

// Get a user by ID
export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ id });
    if (!user) {
      return handleError(res, 'User not found', 404);
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    handleError(res, 'Failed to fetch user');
  }
};

// Function to add a completed task for a user
export const completeTask = async (req, res) => {
  const { telegramId, taskId, status } = req.body;

  if (!taskId || !status) {
    return handleError(res, 'Missing required fields', 400);
  }

  try {
    const user = await User.findOne({ id: telegramId }).populate('tasks');
    if (!user) {
      return handleError(res, 'User not found', 404);
    }

    const existingTask = user.tasks.find(task => task.id === taskId);

    if (existingTask) {
      if (existingTask.status === 'completed' || existingTask.status === 'claimed') {
        return handleError(res, 'Task already completed or claimed', 400);
      }

      if (status === 'completed') {
        existingTask.status = 'completed';
        await existingTask.save();
        return res.status(200).json({ message: 'Task marked as completed', task: existingTask });
      }
    } else {
      const addTask = new Task({ id: taskId, status });
      await addTask.save();

      user.tasks.push(addTask._id);
      await user.save();

      return res.status(201).json({ message: 'Task created and assigned to user', task: addTask });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    handleError(res, 'Failed to complete task');
  }
};

// Get a user's completed tasks
export const getUserTasks = async (req, res) => {
  const { telegramId } = req.params;

  try {
    const user = await User.findOne({ id: telegramId }).populate('tasks');
    if (!user) {
      return handleError(res, 'User not found', 404);
    }

    res.status(200).json(user.tasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    handleError(res, 'Failed to fetch tasks');
  }
};

// Get a user's friend list
export const getUserFrens = async (req, res) => {
  const { telegramId } = req.params;

  try {
    const user = await User.findOne({ id: telegramId }).populate('frens');
    if (!user) {
      return handleError(res, 'User not found', 404);
    }

    res.status(200).json(user.frens);
  } catch (error) {
    console.error('Error fetching user friends:', error);
    handleError(res, 'Failed to fetch friends');
  }
};

// Claim rewards
export const claimRewards = async (req, res) => {
  const { newPoints, telegramId, taskId, status } = req.body;

  if (!telegramId || newPoints === undefined || !taskId || !status) {
    return handleError(res, 'Missing required fields', 400);
  }

  try {
    const user = await User.findOne({ id: telegramId }).populate('tasks');
    if (!user) {
      return handleError(res, 'User not found', 404);
    }

    const task = user.tasks.find(task => task.id === taskId.toString());
    if (!task) {
      return handleError(res, `Task with ID ${taskId} not found`, 404);
    }

    if (task.status === 'claimed') {
      return handleError(res, 'Reward already claimed', 400);
    }

    task.status = status;
    await task.save();

    user.LIONS += newPoints;
    await user.save();

    res.status(200).json({ message: 'Rewards claimed successfully', user });
  } catch (error) {
    console.error('Error claiming rewards:', error);
    handleError(res, 'Failed to claim rewards');
  }
};