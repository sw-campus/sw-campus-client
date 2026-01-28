'use client'

import { useState } from 'react'

import Image from 'next/image'

import PrivacyContent from '@/components/legal/privacy-content'
import TermsContent from '@/components/legal/terms-content'
import Modal from '@/components/ui/modal'

export default function Footer() {
  const [openTerms, setOpenTerms] = useState(false)
  const [openPrivacy, setOpenPrivacy] = useState(false)

  return (
    <>
      <footer className="bg-footer-bg text-footer-text">
        <div className="container-responsive flex flex-col gap-4 py-8 md:gap-6 md:py-10">
          {/* 상단 영역 - 모바일: 세로, 데스크톱: 가로 */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* 로고 및 회사명 */}
            <div className="flex items-center gap-2">
              <div className="relative size-6 md:size-8">
                <Image src="/images/logo.png" alt="SOFTWARE CAMPUS" fill className="object-contain brightness-0 invert" />
              </div>
              <span className="text-sm font-semibold text-white md:text-2xl md:font-extrabold">SOFTWARE CAMPUS</span>
            </div>

            {/* 메뉴 - 데스크톱에서만 상단에 표시 */}
            <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
              <button
                type="button"
                onClick={() => setOpenTerms(true)}
                className="font-bold text-footer-muted transition-colors hover:text-white"
              >
                서비스 이용약관
              </button>
              <span className="h-3 w-px bg-footer-muted/50" />
              <button
                type="button"
                onClick={() => setOpenPrivacy(true)}
                className="font-bold text-footer-muted transition-colors hover:text-white"
              >
                개인정보처리방침
              </button>
            </nav>
          </div>

          {/* 회사 정보 */}
          <div className="flex flex-col gap-1 text-xs text-footer-muted md:text-sm">
            <p>상호명 : 소프트웨어캠퍼스</p>
            <p>위치 : 서울특별시 금천구 가산디지털1로 70 912호</p>
            <p>문의 : swcampus1127@gmail.com</p>
          </div>

          {/* 법적 고지 */}
          <p className="text-[10px] leading-relaxed text-footer-muted md:text-xs">
            본 웹사이트 내의 교육과정 및 운영정보, 디자인 및 화면의 구성, UI를 포함한 일체의 콘텐츠에 대한 무단 복제, 배포,
            가공, 크롤링, 스크래핑 등의 행위는 저작권법 콘텐츠산업진흥법 및 부정경쟁방지법 등 관련 법령에 의하여 금지됩니다.
          </p>

          {/* 하단 링크 */}
          <div className="flex items-center justify-between border-t border-footer-muted/30 pt-4">
            <span className="text-xs text-footer-muted">copyright © Software Campus</span>
            {/* 모바일에서만 하단에 표시 */}
            <div className="flex items-center gap-2 text-xs md:hidden">
              <button
                type="button"
                onClick={() => setOpenTerms(true)}
                className="text-footer-muted hover:text-footer-text"
              >
                서비스 이용약관
              </button>
              <span className="text-footer-muted">|</span>
              <button
                type="button"
                onClick={() => setOpenPrivacy(true)}
                className="text-footer-muted hover:text-footer-text"
              >
                개인정보처리방침
              </button>
            </div>
          </div>
        </div>
      </footer>

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
    </>
  )
}
