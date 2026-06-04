"use client"

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
//@ts-ignore
import 'swiper/css';
//@ts-ignore
import 'swiper/css/free-mode';
//@ts-ignore
import 'swiper/css/navigation';
//@ts-ignore
import 'swiper/css/thumbs';
//@ts-ignore
import 'swiper/css/pagination';

import { Autoplay, Pagination } from 'swiper/modules';
import { CSSProperties } from 'react';

type ImageType = {
  src: string
  alt: string
}

type Props = {
  images: ImageType[]
}

const SwiperCarouselAboutUs: React.FC<Props> = ({ images }) => {
  const imageList = images;
  
  return (
    <Swiper
      loop={true}
      spaceBetween={0}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: false, // Prevent pagination bullet clicks
      }}
      allowTouchMove={false}
      modules={[Autoplay, Pagination]}
      className="mySwiper2 h-96"
      style={{
        '--swiper-pagination-color': '#e60013',
        '--swiper-navigation-color': '#e60013',
      } as CSSProperties}
    >
      {imageList.map((image, index) => (
        <SwiperSlide key={index}>
          <img
            src={image.src.startsWith('/uploads/') ? `${process.env.NEXT_PUBLIC_ROOT_URL}${image.src}` : image.src}
            alt={image.alt}
            width={500}
            height={400}
            className="h-full object-cover"
          />
        </SwiperSlide>     
      ))}
    </Swiper>
  );
}

export default SwiperCarouselAboutUs