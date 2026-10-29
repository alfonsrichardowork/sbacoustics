'use client'

import { Triangle } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import '@/app/globals.css'

type Hotspot = {
  id: string
  label: string
  description: string
  x: number
  y: number
}

type ExplodeMediaProps = {
  slug: string
  hotspots?: Hotspot[]
}

const defaultHotspots: Hotspot[] = [
  {
    id: '1',
    label: 'Title 1',
    description: 'Description 1',
    x: 17.5,
    y: 56,
  },
  {
    id: '2',
    label: 'Title 2',
    description: 'Description 2',
    x: 22.5,
    y: 67,
  },
  {
    id: '3',
    label: 'Title 3',
    description: 'Description 3',
    x: 26,
    y: 54,
  },
  {
    id: '4',
    label: 'Title 4',
    description: 'Description 4',
    x: 32,
    y: 64,
  },
  {
    id: '5',
    label: 'Title 5',
    description: 'Description 5',
    x: 39,
    y: 70,
  },
  {
    id: '6',
    label: 'Titanium Voice-Coil Former',
    description: 'Ultra precise titanium former delivers exceptional thermal conductivity and structural rigidity, preserving perfect coil geometry and transferring microdetail with absolute clarity',
    x: 43,
    y: 54,
  },
  {
    id: '7',
    label: 'Title 7',
    description: 'Description 7',
    x: 47,
    y: 25,
  },
  {
    id: '8',
    label: 'Title 8',
    description: 'Description 8',
    x: 51.5,
    y: 55,
  },
  {
    id: '9',
    label: 'Title 9',
    description: 'Description 9',
    x: 58,
    y: 58,
  },
  {
    id: '10',
    label: 'Title 10',
    description: 'Description 10',
    x: 64,
    y: 40,
  },
  {
    id: '11',
    label: 'Title 11',
    description: 'Description 11',
    x: 73,
    y: 65,
  },
  {
    id: '12',
    label: 'Title 12',
    description: 'Description 12',
    x: 81,
    y: 53,
  },
]

export default function ExplodeMedia({ slug, hotspots = defaultHotspots }: ExplodeMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible && videoRef.current && !videoEnded) {
      videoRef.current.play().catch(() => {
        // Autoplay can be blocked until the user interacts with the page.
      })
    }
  }, [isVisible, videoEnded])

  const active = hotspots.find((hotspot) => hotspot.id === activeHotspot)

  return (
    <section ref={containerRef} aria-label="Exploded Speaker" className='w-full'>
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <img
          src={`/images/sbautomotive/${slug}/explode.png`}
          alt={`${slug} exploded vehicle specifications`}
          width={1000}
          height={1000}
          className="block h-auto w-full"
        />

        {!videoEnded && (
          <video
            ref={videoRef}
            src={`/images/sbautomotive/${slug}/explode.mkv`}
            muted
            playsInline
            preload="metadata"
            aria-label="Exploded vehicle animation"
            onEnded={() => setVideoEnded(true)}
            className="absolute inset-0 h-full w-full object-contain"
          />
        )}

        {videoEnded && (
            <div className="hotspot-entrance absolute inset-0" aria-label="Interactive parts">
                {hotspots.map((hotspot) => {
                const isActive = activeHotspot === hotspot.id
                return (
                    <button
                    key={hotspot.id}
                    type="button"
                    aria-label={`Show ${hotspot.label} description`}
                    aria-pressed={isActive}
                    onClick={() => setActiveHotspot(isActive ? null : hotspot.id)}
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-lg p-2 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${isActive ? 'z-20 scale-125' : 'z-10 opacity-75 hover:scale-110 hover:opacity-100'}`}
                    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                    >
                    {isActive ? (
                        <Image
                        src="/images/sbacoustics/loadersba.png"
                        alt=""
                        width={100}
                        height={100}
                        className="lg:size-5 md:size-4 size-3 drop-shadow-[0_0_8px_rgba(239,68,68,0.95)]"
                        />
                    ) : (
                        // <Triangle className="lg:size-5 md:size-4 size-3 rotate-180 fill-transparent stroke-primary stroke-4 drop-shadow-md animate-bounce hover:cursor-pointer" aria-hidden="true" />
                        <Image
                        src="/images/sbautomotive/triangle.svg"
                        alt=""
                        width={100}
                        height={100}
                        className="lg:size-5 md:size-4 size-3 drop-shadow-[0_0_8px_rgba(239,68,68,0.95)] rotate-180 font-bold"
                        />
                    )}
                    </button>
                )
                })}

                {active && (
                    <>
                        <svg
                        className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible"
                        aria-hidden="true"
                        preserveAspectRatio="none"
                        >
                            <line
                                x1={`${active.x}%`}
                                y1={`${active.y}%`}
                                x2={`${active.x}%`}
                                y2="7%"
                                stroke="red"
                                strokeWidth="2"
                                strokeDasharray="5 5"
                                vectorEffect="non-scaling-stroke"
                                opacity="0.9"
                            />
                            <line
                                x1={`${active.x}%`}
                                y1="7%"
                                x2="4%"
                                y2="7%"
                                stroke="red"
                                strokeWidth="2"
                                strokeDasharray="5 5"
                                vectorEffect="non-scaling-stroke"
                                opacity="0.9"
                            />
                            
                        </svg>
                        <aside
                        role="status"
                        className="absolute z-20"
                        style={{ left: '3%', top: '6%' }}
                        >
                            <Image
                                src="/images/sbacoustics/loadersba.png"
                                alt=""
                                width={100}
                                height={100}
                                className="lg:size-5 md:size-4 size-3 drop-shadow-[0_0_8px_rgba(239,68,68,0.95)]"
                            />
                        </aside>
                        <aside
                        role="status"
                        className="absolute z-20 p-2 text-white sm:max-w-sm break-normal w-fit bg-black/50 backdrop-blur-md backdrop-opacity-40 rounded-lg"
                        style={{ left: '3%', top: '10%' }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="mt-1 text-sm font-semibold">{active.label}</p>
                                    <p className="mt-1 text-sm leading-5 text-white/75">{active.description}</p>
                                </div>
                            </div>
                        </aside>
                    </>
                )}
            </div>
        )}
      </div>
    </section>
  )
}