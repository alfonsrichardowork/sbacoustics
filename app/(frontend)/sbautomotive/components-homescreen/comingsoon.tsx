import * as React from 'react';
import { Card } from '@/components/ui/card';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';


export default function ComingSoon() {
  return (
    <>
        <div className="w-screen h-screen bg-black text-white text-3xl flex items-center justify-center">
            Coming soon!
        </div>
    </>
  );
}
