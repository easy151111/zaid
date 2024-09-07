import { Link } from "react-router-dom"

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Slider = () => {
  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={10}
      slidesPerView={1.06}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
      className="gap-10 p-[1rem] pr-0 text-black w-full"
    >
      <SwiperSlide className="min-w-[19rem] max-w-[20rem]">
        <div className="w-full p-4 py-4 bg-[#1A1A1A] h-[8rem] flex flex-col justify-between items-start rounded-[20px]">
          <h1 className="font-bold text-[18px] leading-none text-white ">
            SUBSCRIBE YOUTUBE
            <br />
            <span className="text-[16px]">
            Learn from videos
            </span>
          </h1>

          <button
            onClick={() => window.open("https://www.youtube.com/@the_ratskingdom?feature=shared", "_blank")}
            className="rounded-full p-2 px-4 font-semibold bg-white text-black"
          >
            View
          </button>

        </div>
      </SwiperSlide>

      <SwiperSlide className="min-w-[19rem] max-w-[20rem]">
        <div className="w-full p-4 py-4 bg-[#1A1A1A] h-[8rem] flex flex-col justify-between items-start rounded-[20px]">
          <h1 className="font-bold text-[18px] leading-none text-white ">
            JOIN RATS KINGDOM
            <br />
            <span className="text-[16px]">
              Home for Telegram OGs
            </span>
          </h1>

          <Link to="https://t.me/The_RatsKingdom" className="rounded-full p-2 px-4 font-semibold bg-white text-black">
            Join
          </Link>
        </div>
      </SwiperSlide>
      <SwiperSlide className="min-w-[19rem] max-w-[20rem]">
        <div className="w-full p-4 py-4 bg-[#1A1A1A] h-[8rem] flex flex-col justify-between items-start rounded-[20px]">
          <h1 className="font-bold text-[18px] leading-none text-white ">
            FOLLOW X (TWITTER)
            <br />
            <span className="text-[16px]">
              Stay updated with the latest news
            </span>
          </h1>

          <button
            onClick={() => window.open("https://x.com/The_RatsKingdom", "_blank")}
            className="rounded-full p-2 px-4 font-semibold bg-white text-black"
          >
            Follow
          </button>

        </div>
      </SwiperSlide>
      ...
    </Swiper>
  );
};

export default Slider;