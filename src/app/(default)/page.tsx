'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'

import LargeBanner from '@/features/banner/components/LargeBanner'
import MidBanner from '@/features/banner/components/MidBanner'
import LectureSection from '@/features/lecture/components/LectureSection'

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

export default function Home() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={container}
      initial={reduceMotion ? false : 'hidden'}
      animate={reduceMotion ? undefined : 'show'}
    >
      <motion.div variants={fadeUp}>
        <LargeBanner />
      </motion.div>
      <motion.div variants={fadeUp}>
        <MidBanner />
      </motion.div>
      <motion.div variants={fadeUp}>
        <LectureSection />
      </motion.div>
    </motion.div>
  )
}
