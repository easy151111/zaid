export interface Task {
  id: number;
  title: string;
  icon: string;
  points: number;
  type: 'start' | 'check' | 'link';
  status: 'incomplete' | 'completed' | 'claimed';
  condition?: (user: IUser, account: any) => boolean; // Updated to accept account
  url?: string;
  successMessage?: string;
  failureMessage?: string;
}

export const tasks: Task[] = [
  {
    id: 1,
    title: 'Account age',
    icon: 'stars',
    points: 800,
    type: 'check',
    status: 'incomplete',
    condition: (user: IUser) => true,
    successMessage: "You've successfully completed the Account Age task!",
    failureMessage: "You haven't met the requirements for the Account Age task.",
  },
  {
    id: 2,
    title: 'Telegram Premium',
    icon: 'telegram',
    points: 400,
    type: 'check',
    status: 'incomplete',
    condition: (user: IUser) => user && user.isPremium === true,
    successMessage: "You've successfully completed the Telegram Premium task!",
    failureMessage: "You haven't met the requirements for the Telegram Premium task.",
  },
  {
    id: 3,
    title: 'Subscribe to Rats Kingdom Channel',
    icon: 'telegram',
    points: 250,
    type: 'link',
    status: 'incomplete',
    url: 'https://t.me/The_RatsKingdom',
    successMessage: "Thanks for subscribing to the Rats Kingdom Channel!",
  },
  {
    id: 4,
    title: 'Connect Wallet',
    icon: 'wallet',
    points: 100,
    type: 'check',
    status: 'incomplete',
    condition: (user: IUser, account: any) => !!account, // Check if the wallet is connected
    successMessage: "Wallet connected successfully!",
    failureMessage: "You need to connect your wallet to complete this task.",
  },
  {
    id: 5,
    title: 'Make a TON Transaction',
    icon: 'wallet',
    points: 30000,
    type: 'start',
    status: 'incomplete',
    condition: (user: IUser, account: any) => user.walletAddress && user.hasMadeTransaction, // Check if the wallet has made a transaction
    successMessage: "You've made a transaction with your wallet!",
    failureMessage: "No transactions found. Please make a transaction with your wallet.",
  },
  {
    id: 6,
    title: 'Invite 5 Friends to Rats Kingdom',
    icon: 'users',
    points: 20000,
    type: 'check',
    status: 'incomplete',
    condition: (user: IUser) => user && user.frens.length >= 5,
    successMessage: "Great! You invited 5 friends.",
    failureMessage: "You need to invite 5 friends to complete this task.",
  },
  {
    id: 7,
    title: 'Follow Rats Kingdom on X',
    icon: 'telegram',
    points: 400,
    type: 'link',
    status: 'incomplete',
    url: 'https://x.com/The_RatsKingdom',
    successMessage: "Thanks for following the Rats Kingdom X account!",
  },
  {
    id: 8,
    title: 'Invite 10 Friends to Rats Kingdom',
    icon: 'users',
    points: 25000,
    type: 'check',
    status: 'incomplete',
    condition: (user: IUser) => user && user.frens.length >= 10,
    successMessage: "Great! You invited 10 friends.",
    failureMessage: "You need to invite 10 friends to complete this task.",
  },
  {
    id: 9,
    title: 'Subscribe to our YouTube channel',
    icon: 'youtube',
    points: 400,
    type: 'link',
    status: 'incomplete',
    url: 'https://youtube.com/@the_ratskingdom?feature=shared',
    successMessage: "Thanks for subscribing to the Rats Kingdom YouTube channel!",
  },
];