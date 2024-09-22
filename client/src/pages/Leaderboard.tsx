import { type FC, useState, useEffect } from 'react';
import Avatar from 'react-avatar';
import { Link } from "../components/Link";
import { useUserContext } from "../context/AuthContext";
import { Loader, UserList } from "../components";

export const Leaderboard: FC = () => {
   const { user, leaderboard } = useUserContext();

  const [loading, setLoading] = useState(true);  // Loading state
  const [userPosition, setUserPosition] = useState<number | null>(null);  // User position state
  const [holders, setHolders] = useState<number | null>(null);  // Holders state

  useEffect(() => {
    if (leaderboard) {
      // Find the current user's position in the leaderboard
      setUserPosition(leaderboard.userPosition);
      setHolders(leaderboard.totalUsers);
      setLoading(false);
    }
  }, [leaderboard, user?.id]);


  if (loading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  if (!leaderboard) {
    return (
      <div className="flex-center w-full h-full">
        <p>No leaderboard data available.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-[1rem] p-[1rem] flex flex-col gap-6 items-center">
        <h1 className="text-[#FFFFFF] font-bold text-[30px]">
          Telegram Wall Of Fame
        </h1>

        <div className="bg-[#1A1A1A] rounded-lg w-full p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              name={`${user?.username.charAt(0)} ${user.username.slice(1)}`}
              size="40"
              textSizeRatio={1.75}
              round={true}
            />
            <div>
              <h1 className="text-white font-medium text-[15px]">
                {user?.username}
              </h1>
              <span className="font-semibold">{user?.LIONS} LIONS</span>
            </div>
          </div>

          <span className="text-white font-semibold">
            #{userPosition}
          </span>
        </div>

        <div className="my-4 mb-[5rem] w-full">
          <h1 className="text-white font-semibold text-[20px]">
            {holders || 0} holder{holders > 1 && 's'}
          </h1>

          <div className="flex flex-col gap-4 mt-6">
            {leaderboard.users && (
              <UserList users={leaderboard.users} />
            )}

          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full h-[4rem] p-4 flex items-center justify-between bg-black rounded-t-lg">
        <Link
          to="/"
          className={`w-full flex flex-col text-[12px] items-center gap-[2px] ${
            location.pathname === "/" ? "invert-white text-white font-bold" : ""
          }`}
        >
          <img src="/assets/icons/home.svg" alt="home" className="w-[1.5rem] h-[1.5rem]" />
          Home
        </Link>

        <Link
          to="/leaderboard"
          className={`w-full flex flex-col text-[12px] items-center gap-[2px] ${
            location.pathname === "/leaderboard" ? "invert-white text-white font-bold" : ""
          }`}
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
          className={`w-full flex flex-col text-[12px] items-center gap-[2px] ${
            location.pathname === "/frens" ? "invert-white text-white font-bold" : ""
          }`}
        >
          <img src="/assets/icons/frens.svg" alt="Frens" className="w-[1.5rem] h-[1.5rem]" />
        </Link>
      </div>
    </>
  );
};
