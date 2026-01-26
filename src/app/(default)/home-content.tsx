'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'

import {
  AiCompareSection,
  BannerCarousel,
  BootcampListSection,
  EventSection,
  MainBanner,
  PartnerSection,
} from '@/features/home/components'

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

export default function HomeContent() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={container}
      initial={reduceMotion ? false : 'hidden'}
      animate={reduceMotion ? undefined : 'show'}
      className="flex flex-col"
    >
      <motion.div variants={fadeUp}>
        <MainBanner />
      </motion.div>

      <motion.div variants={fadeUp}>
        <AiCompareSection />
      </motion.div>

      <motion.div variants={fadeUp}>
        <BannerCarousel />
      </motion.div>

      <motion.div variants={fadeUp}>
        <BootcampListSection />
      </motion.div>

      <motion.div variants={fadeUp}>
        <PartnerSection />
      </motion.div>

      <motion.div variants={fadeUp}>
        <EventSection />
      </motion.div>
    </motion.div>
  )
}
