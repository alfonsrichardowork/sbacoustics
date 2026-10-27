"use client";

import Image from "next/image";
import styles from '@/app/css/styles.module.css'

export const Loader = () => {
  return <div className={styles.iconCSS} ><Image alt="loader_Sba" src={'/images/sbacoustics/loadersba.svg'} priority
  fill
  style={{ objectFit: 'contain' }}/></div>
};
