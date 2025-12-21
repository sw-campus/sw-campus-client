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
    <footer className="mx-auto mb-10 w-full max-w-7xl rounded-3xl border border-white/15 bg-white/10 p-10 pb-10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      {/* 상단 영역 */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="text-2xl font-extrabold tracking-tight text-white">SOFTWARE CAMPUS</div>

        {/* 메뉴 */}
        <nav className="flex flex-wrap gap-6 text-sm font-medium">
          <Link
            href="#"
            onClick={e => {
              e.preventDefault()
              setOpenTerms(true)
            }}
            className="text-white/90 hover:text-white"
          >
            서비스 이용약관
          </Link>
          <span className="text-white/30">|</span>
          <Link
            href="#"
            onClick={e => {
              e.preventDefault()
              setOpenPrivacy(true)
            }}
            className="text-white/90 hover:text-white"
          >
            개인정보처리방침
          </Link>
        </nav>
      </div>

      {/* 회사 정보 */}
      <div className="mt-8 text-sm leading-relaxed text-white/80">
        소프트웨어캠퍼스
        <br />
        서울특별시 종로구 우정국로 2길 21 대왕빌딩 7층
        <br />
        E-mail. sw.campus2025@gmail.com
      </div>

      {/* 하단 설명 */}
      <div className="mt-6 text-xs leading-relaxed text-white/70">
        본 웹사이트 내의 교육과정 및 운영 정보, 디자인 및 화면의 구성, UI를 포함한 일체의 콘텐츠에 대한 <br />
        무단 복제, 배포, 가공, 크롤링, 스크래핑 등의 행위는 저작권법, 콘텐츠산업진흥법 및 부정경쟁방지법 등 관련 법령에
        의하여 금지됩니다.
      </div>

      <div className="mt-10 text-xs text-white/50">Copyright © Software Campus</div>
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
