const Loader = () => {

  return (
    <div className="z-[100] fixed top-0 left-0 flex justify-center items-center w-full h-screen">
      <img
        src="/assets/loader.svg"
        alt="loader"
        width={34}
        height={34}
        className="animate-spin invert-white"
      />
    </div>
  );
}
export default Loader;