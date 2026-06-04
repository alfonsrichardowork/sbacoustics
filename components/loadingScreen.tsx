'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader } from './ui/loader'

interface LoadingScreenProps {
  isLoading: boolean
  onLoadingComplete?: () => void
}

export function LoadingScreen({ isLoading, onLoadingComplete }: LoadingScreenProps) {
  const [displayLoading, setDisplayLoading] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      setDisplayLoading(true)
    } else {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setDisplayLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <AnimatePresence>
      {displayLoading && (
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="fixed inset-0 bg-black flex items-center justify-center z-50"
        >
          <div className="flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center justify-center"
            >
                <Loader />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
