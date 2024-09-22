import { useEffect, useState, type FC } from 'react';
import axios from 'axios';
import Avatar from 'react-avatar';

import { useUserContext } from '../context/AuthContext';
import { Link } from "../components/Link";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "../components/ui/animated-modal";
import { Loader } from "../components";  // Import your Loader component

export const Frens: FC = () => {
  const { user, frens } = useUserContext();
  const referralLink = `http://t.me/LIONS_Bot/join?startapp=${user?._id}`;

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    if (frens) {
      setLoading(false);
    }
  }, [frens, user?.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleShareLink = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join%20me%20and%20earn%20LIONS%20using%20this%20link!`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-[100dvh]">
          <Loader /> 
        </div>
      ) : (
        <>
          <div className="my-8 flex flex-col items-center text-center gap-4">
            <div className="leading-none font-bold text-white text-[32px]">
              <h1>Invite friends</h1>
              <h2>and get more LIONS</h2>
            </div>

            <img 
              src="/assets/logo.png"
              alt="LIONS"
              width={170}
              height={170}
            />
          </div>

          {frens.length > 0 ? (
            <div className="p-[1rem] my-4 mb-[5rem]">
              <div className="flex items-center justify-between">
                <h1 className="text-white font-semibold text-[20px]">{frens.length} friend{frens.length > 1 && 's'}</h1>

                <Modal>
                  <ModalTrigger className="bg-white text-black flex justify-center group/modal-btn">
                    <span className="font-semibold group-hover/modal-btn:translate-x-40 text-center transition duration-500">
                      Invite
                    </span>
                  </ModalTrigger>

                  <ModalBody>
                    <ModalContent>
                      <div className="w-full text-center pb-4 border-b border-white/50">
                        <h1 className="font-bold text-[20px] text-white">Invite friends</h1>
                      </div>

                      <div className="mt-[1rem] h-[10rem] flex flex-col gap-4 items-center justify-center">
                        <button onClick={handleCopyLink} disabled={copied} className="rounded-lg w-full p-4 flex items-center justify-center bg-white text-black font-semibold">
                          {copied ? 'Copied' : 'Copy Invite Link'}
                        </button>

                        <button onClick={handleShareLink} className="rounded-lg w-full p-4 flex items-center justify-center bg-white text-black font-semibold">
                          Share Invite Link
                        </button>
                      </div>

                      <span>Invite friends to get more LIONS</span>
                    </ModalContent>
                  </ModalBody>
                </Modal>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                {frens.map((fren) => (
                  <div key={fren.id} className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar name={fren?.username.charAt(0) + " " + user.username.slice(1)} size="40" textSizeRatio={1.75} round={true} />

                      <h1 className="text-white font-medium text-[15px]">
                        {fren.username}
                      </h1>
                    </div>

                    <span className="text-white font-semibold">
                      +{fren.uplineBonus} LIONS
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-[1rem] mt-[4rem] flex flex-col gap-8 text-center">
              <h1 className="font-semibold text-xl text-white">Tap on the button to invite your friends</h1>

              <Modal>
                <ModalTrigger className="bg-white text-black flex justify-center group/modal-btn">
                  <span className="font-semibold group-hover/modal-btn:translate-x-40 text-center transition duration-500">
                    Invite Friends
                  </span>
                </ModalTrigger>

                <ModalBody>
                  <ModalContent>
                    <div className="w-full text-center pb-4 border-b border-white/50">
                      <h1 className="font-bold text-[20px] text-white">Invite friends</h1>
                    </div>

                    <div className="mt-[1rem] h-[10rem] flex flex-col gap-4 items-center justify-center">
                      <button onClick={handleCopyLink} disabled={copied} className="rounded-lg w-full p-4 flex items-center justify-center bg-white text-black font-semibold">
                        {copied ? 'Copied' : 'Copy Invite Link'}
                      </button>

                      <button onClick={handleShareLink} className="rounded-lg w-full p-4 flex items-center justify-center bg-white text-black font-semibold">
                        Share Invite Link
                      </button>
                    </div>

                    <span>Invite friends to get more LIONS</span>
                  </ModalContent>
                </ModalBody>
              </Modal>
            </div>
          )}
        </>
      )}

      <div className="fixed bottom-0 w-full h-[4rem] p-4 flex items-center justify-between bg-black rounded-t-lg">
        <Link 
          to='/' 
          className={`w-full flex flex-col text-[12px] items-center gap-[2px] ${location.pathname === '/' ? 'invert-white text-white font-bold' : ''}`}
        >
          <img 
            src="/assets/icons/home.svg"
            alt="home"
            className="w-[1.5rem] h-[1.5rem]"
          />
          Home
        </Link>

        <Link 
          to='/leaderboard' 
          className={`w-full flex flex-col text-[12px] items-center gap-[2px] ${location.pathname === '/leaderboard' ? 'invert-white text-white font-bold' : ''}`}
        >
          <img 
            src="/assets/icons/leaderboard.svg"
            alt="Leaderboard"
            className="w-[1.5rem] h-[1.5rem]"
          />

          Leaderboard
        </Link>

        <Link 
          to='/frens' 
          className={`w-full flex flex-col text-[12px] items-center gap-[2px] ${location.pathname === '/frens' ? 'invert-white text-white font-bold' : ''}`}
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
