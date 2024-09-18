import { TonConnectButton, useTonConnectModal } from '@tonconnect/ui-react';

const Topbar = () => {
  const { state, open, close } = useTonConnectModal();
  
  return (
    <div className="sticky top-0 flex w-full p-4 justify-between bg-black/30 backdrop-blur items-center z-[99]">
      <h1 className="font-bold text-white text-[20px]">Rats Kingdom</h1>

      <TonConnectButton className=''/>
    </div>
  );
}

export default Topbar;