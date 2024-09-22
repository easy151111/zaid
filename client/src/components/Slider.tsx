import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Slider = () => {
  // Memoize slide data to avoid re-creating it on every render
  const slides = useMemo(() => [
    {
      title: "SUBSCRIBE YOUTUBE",
      description: "Learn from videos",
      action: {
        text: "View",
        onClick: () => window.open("https://www.youtube.com/@LIONS?feature=shared", "_blank"),
      },
    },
    {
      title: "JOIN LIONS KINGDOM",
      description: "Home for Telegram OGs",
      action: {
        text: "Join",
        link: "https://t.me/LIONS",
      },
    },
    {
      title: "FOLLOW X (TWITTER)",
      description: "Stay updated with the latest news",
      action: {
        text: "Follow",
        onClick: () => window.open("https://x.com/LIONS", "_blank"),
      },
    },
  ], []);

  // Use useCallback for reusable click handlers
  const handleActionClick = useCallback((action) => {
    if (action.onClick) {
      action.onClick();
    }
  }, []);

  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={10}
      slidesPerView={1.06}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      className="gap-10 p-[1rem] pr-0 text-black w-full"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index} className="min-w-[19rem] max-w-[20rem]">
          <div className="w-full p-4 py-4 bg-[#1A1A1A] h-[8rem] flex flex-col justify-between items-start rounded-[20px]">
            <h1 className="font-bold text-[18px] leading-none text-white ">
              {slide.title}
              <br />
              <span className="text-[16px]">{slide.description}</span>
            </h1>

            {slide.action.link ? (
              <Link
                to={slide.action.link}
                className="rounded-full p-2 px-4 font-semibold bg-white text-black"
              >
                {slide.action.text}
              </Link>
            ) : (
              <button
                onClick={() => handleActionClick(slide.action)}
                className="rounded-full p-2 px-4 font-semibold bg-white text-black"
              >
                {slide.action.text}
              </button>
            )}
          </div>
        </SwiperSlide>
      ))}
      ...
    </Swiper>
  );
};

export default Slider;