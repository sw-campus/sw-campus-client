'use client'

import { ImageOff } from 'lucide-react'
import type { CartItem } from '@/features/cart/types/cart.type'

interface PCAIBannerProps {
  selectedItems: CartItem[]
  isFilterOpen?: boolean
}

export function PCAIBanner({ selectedItems, isFilterOpen = true }: PCAIBannerProps) {
  const item1 = selectedItems[0]
  const item2 = selectedItems[1]

  // 필터 열림: 작은 사이즈, 닫힘: 큰 사이즈
  const containerHeight = isFilterOpen ? 'h-[380px]' : 'h-[480px]'
  const bannerPadding = isFilterOpen ? 'p-3' : 'p-4'
  const headerClass = isFilterOpen ? 'text-base' : 'text-xl'
  const descClass = isFilterOpen ? 'text-sm' : 'text-base'
  const imageHeight = isFilterOpen ? 'h-[100px]' : 'h-[140px]'
  const cardPadding = isFilterOpen ? 'p-4' : 'p-5'
  const titleClass = isFilterOpen ? 'text-base' : 'text-2xl' // 필터 닫힘: 아래 강의 카드와 동일한 크기
  const _titleMinHeight = isFilterOpen ? 'min-h-[24px]' : 'min-h-[56px]'
  const titleLineClamp = isFilterOpen ? 'line-clamp-1' : 'line-clamp-2'
  const buttonHeight = isFilterOpen ? 'h-9' : 'h-11'
  const buttonTextClass = isFilterOpen ? 'text-sm' : 'text-base'
  const vsSize = isFilterOpen ? 'w-[60px] h-[60px]' : 'w-[70px] h-[70px]'
  const vsTextClass = isFilterOpen ? 'text-xl' : 'text-2xl'
  const bottomButtonHeight = isFilterOpen ? 'h-10' : 'h-12'
  const placeholderTextClass = isFilterOpen ? 'text-sm' : 'text-base'

  return (
    <div className={`w-full ${containerHeight} flex flex-col gap-4`}>
      {/* AI 추천 텍스트 배너 */}
      <div className={`w-full ${bannerPadding} bg-[#FFFCF4] rounded-xl shadow-[2px_2px_10px_rgba(161,161,170,0.25)] flex flex-col gap-2`}>
        <h3 className={`${headerClass} font-semibold text-[#020202] text-center`}>
          <span className="text-[#FEB706]">AI 비교분석 기능</span>으로 최적의 강의를 한 눈에 비교해보세요.
        </h3>
        <p className={`${descClass} text-black leading-relaxed text-center`}>
          관심 과정에서 비교할 강의를 선택하면 AI가 자동으로 분석하여 최적의 강의를 추천해 드립니다.
        </p>
      </div>

      {/* VS Comparison - 항상 표시 */}
      <div className="relative flex items-stretch gap-4 flex-1">
        {/* Card 1 */}
        <div className={`flex-1 ${cardPadding} bg-white rounded-xl shadow-[4px_4px_20px_rgba(161,161,170,0.25)] flex flex-col gap-3`}>
          <div className={`w-full ${imageHeight} rounded-lg overflow-hidden bg-[#E5E5E5] flex-shrink-0`}>
            {item1 ? (
              item1.thumbnailUrl ? (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${item1.thumbnailUrl})` }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#E5E5E5]">
                  <ImageOff className="w-6 h-6 text-[#888888]" />
                </div>
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#E5E5E5]">
                <span className="text-[#888888] text-xs">이미지 없음</span>
              </div>
            )}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <h4 className={`${titleClass} font-bold text-[#020202] text-center ${titleLineClamp}`}>
              {item1 ? item1.title : <span className={`text-[#888888] font-normal ${placeholderTextClass}`}>강의를 선택해주세요</span>}
            </h4>
          </div>
          <button
            className={`w-full ${buttonHeight} bg-[#F9F9F9] rounded-lg flex items-center justify-center flex-shrink-0 ${!item1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!item1}
          >
            <span className={`${buttonTextClass} text-[#020202]`}>자세히 보기</span>
          </button>
        </div>

        {/* VS Badge */}
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${vsSize} bg-[#020202] rounded-full flex items-center justify-center z-10`}>
          <span className={`${vsTextClass} font-bold text-[#FEB706]`}>VS</span>
        </div>

        {/* Card 2 */}
        <div className={`flex-1 ${cardPadding} bg-white rounded-xl shadow-[4px_4px_20px_rgba(161,161,170,0.25)] flex flex-col gap-3`}>
          <div className={`w-full ${imageHeight} rounded-lg overflow-hidden bg-[#E5E5E5] flex-shrink-0`}>
            {item2 ? (
              item2.thumbnailUrl ? (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${item2.thumbnailUrl})` }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#E5E5E5]">
                  <ImageOff className="w-6 h-6 text-[#888888]" />
                </div>
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#E5E5E5]">
                <span className="text-[#888888] text-xs">이미지 없음</span>
              </div>
            )}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <h4 className={`${titleClass} font-bold text-[#020202] text-center ${titleLineClamp}`}>
              {item2 ? item2.title : <span className={`text-[#888888] font-normal ${placeholderTextClass}`}>강의를 선택해주세요</span>}
            </h4>
          </div>
          <button
            className={`w-full ${buttonHeight} bg-[#F9F9F9] rounded-lg flex items-center justify-center flex-shrink-0 ${!item2 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!item2}
          >
            <span className={`${buttonTextClass} text-[#020202]`}>자세히 보기</span>
          </button>
        </div>
      </div>

      {/* AI 비교 분석 서비스로 이동하기 */}
      <button
        className={`w-full ${bottomButtonHeight} p-3 bg-[#F9F9F9] rounded-xl border border-[#D1D5DB] shadow-[4px_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center ${(!item1 || !item2) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FEB706] hover:border-[#FEB706] transition-colors'}`}
        disabled={!item1 || !item2}
      >
        <span className={`${buttonTextClass} text-[#020202]`}>비교 결과 확인하기</span>
      </button>
    </div>
  )
}
