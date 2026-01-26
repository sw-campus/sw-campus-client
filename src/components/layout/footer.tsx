'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import PrivacyContent from '@/components/legal/privacy-content'
import TermsContent from '@/components/legal/terms-content'
import Modal from '@/components/ui/modal'

export default function Footer() {
  const [openTerms, setOpenTerms] = useState(false)
  const [openPrivacy, setOpenPrivacy] = useState(false)

  return (
    <>
      {/* 모바일 푸터 (md 미만) - Figma 스타일 */}
      <footer className="flex flex-col gap-4 bg-footer-bg px-4 py-8 text-footer-text md:hidden">
        {/* 로고 및 회사명 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="relative size-6">
              <Image src="/images/logo.png" alt="SOFTWARE CAMPUS" fill className="object-contain brightness-0 invert" />
            </div>
            <span className="text-sm font-semibold">SOFTWARE CAMPUS</span>
          </div>

          {/* 회사 정보 */}
          <div className="flex flex-col gap-1 text-xs text-footer-muted">
            <p>상호명 : 소프트웨어캠퍼스</p>
            <p>위치 : 서울특별시 금천구 가산디지털1로 70 912호</p>
            <p>문의 : swcampus1127@gmail.com</p>
          </div>
        </div>

        {/* 법적 고지 */}
        <p className="text-[10px] leading-relaxed text-footer-muted">
          본 웹사이트 내의 교육과정 및 운영정보, 디자인 및 화면의 구성, UI를 포함한 일체의 콘텐츠에 대한 무단 복제, 배포,
          가공, 크롤링, 스크래핑 등의 행위는 저작권법 콘텐츠산업진흥법 및 부정경쟁방지법 등 관련 법령에 의하여 금지됩니다.
        </p>

        {/* 하단 링크 */}
        <div className="flex items-center justify-between border-t border-footer-muted/30 pt-4">
          <span className="text-xs text-footer-muted">copyright © Software Campus</span>
          <div className="flex items-center gap-2 text-xs">
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
      </footer>

      {/* 데스크톱 푸터 (md 이상) - 기존 카드 스타일 */}
      <footer className="mx-auto mb-6 hidden w-full max-w-7xl rounded-2xl border border-gray-200 bg-white/60 p-6 text-gray-800 shadow-lg backdrop-blur-xl md:mb-10 md:rounded-3xl md:p-8 md:block md:p-10">
        {/* 상단 영역 */}
        <div className="flex flex-col gap-4 md:gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-xl font-extrabold tracking-tight text-gray-900 md:text-2xl">SOFTWARE CAMPUS</div>

          {/* 메뉴 */}
          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium md:gap-4">
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
        <div className="mt-6 text-xs leading-relaxed text-gray-600 md:mt-8 md:text-sm">
          소프트웨어캠퍼스
          <br />
          서울특별시 금천구 가산디지털1로 70 912호
          <br />
          문의: swcampus1127@gmail.com
        </div>

        {/* 하단 설명 */}
        <div className="mt-4 text-[10px] leading-relaxed text-gray-500 md:mt-6 md:text-xs">
          본 웹사이트 내의 교육과정 및 운영 정보, 디자인 및 화면의 구성, UI를 포함한 일체의 콘텐츠에 대한 무단 복제, 배포,
          가공, 크롤링, 스크래핑 등의 행위는 저작권법, 콘텐츠산업진흥법 및 부정경쟁방지법 등 관련 법령에 의하여
          금지됩니다.
        </div>

        <div className="mt-6 text-[10px] text-gray-400 md:mt-10 md:text-xs">Copyright © Software Campus</div>
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
