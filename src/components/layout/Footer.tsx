'use client'

import { useState } from 'react'

import Link from 'next/link'

import PrivacyContent from '@/components/legal/PrivacyContent'
import TermsContent from '@/components/legal/TermsContent'
import Modal from '@/components/ui/Modal'

export default function Footer() {
  const [openTerms, setOpenTerms] = useState(false)
  const [openPrivacy, setOpenPrivacy] = useState(false)
  return (
    <footer className="mx-auto mb-6 w-full max-w-7xl rounded-2xl border border-gray-200 bg-white/60 p-6 text-gray-800 shadow-lg backdrop-blur-xl sm:mb-10 sm:rounded-3xl sm:p-8 md:p-10">
      {/* 상단 영역 */}
      <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
        <div className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">SOFTWARE CAMPUS</div>

        {/* 메뉴 */}
        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium sm:gap-4">
          <Link
            href="#"
            onClick={e => {
              e.preventDefault()
              setOpenTerms(true)
            }}
            className="font-bold text-gray-800 transition-colors hover:text-gray-600"
          >
            서비스 이용약관
          </Link>
          <span className="h-3 w-px bg-gray-300" />
          <Link
            href="#"
            onClick={e => {
              e.preventDefault()
              setOpenPrivacy(true)
            }}
            className="font-bold text-gray-800 transition-colors hover:text-gray-600"
          >
            개인정보처리방침
          </Link>
        </nav>
      </div>

      {/* 회사 정보 */}
      <div className="mt-6 text-xs leading-relaxed text-gray-600 sm:mt-8 sm:text-sm">
        소프트웨어캠퍼스
        <br />
        서울특별시 금천구 가산디지털1로 70 912호
        <br />
        문의: swcampus1127@gmail.com
      </div>

      {/* 하단 설명 */}
      <div className="mt-4 text-[10px] leading-relaxed text-gray-500 sm:mt-6 sm:text-xs">
        본 웹사이트 내의 교육과정 및 운영 정보, 디자인 및 화면의 구성, UI를 포함한 일체의 콘텐츠에 대한 무단 복제, 배포,
        가공, 크롤링, 스크래핑 등의 행위는 저작권법, 콘텐츠산업진흥법 및 부정경쟁방지법 등 관련 법령에 의하여
        금지됩니다.
      </div>

      <div className="mt-6 text-[10px] text-gray-400 sm:mt-10 sm:text-xs">Copyright © Software Campus</div>
      {/* Modals */}
      <Modal isOpen={openTerms} onClose={() => setOpenTerms(false)} title="이용약관" maxWidthClass="max-w-2xl">
        <TermsContent />
      </Modal>
      <Modal
        isOpen={openPrivacy}
        onClose={() => setOpenPrivacy(false)}
        title="개인정보처리방침"
        maxWidthClass="max-w-2xl"
      >
        <PrivacyContent />
      </Modal>
    </footer>
  )
}
