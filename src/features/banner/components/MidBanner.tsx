import Image from 'next/image'
import Link from 'next/link'

import SmallBanner from '@/features/banner/components/SmallBanner'

const data = [
  {
    academy: '멋쟁이사자처럼',
    title: '유니티 게임 개발 7기',
    desc: '상상하던 게임을 실제로 개발하는 부트캠프에 합류해요 🔥',
    date: '12/30',
    thumbnail: '/images/mid-banner/banner-unity.png',
    href: '/',
  },
  {
    academy: '내일배움캠프',
    title: '콘텐츠 마케터 부트캠프 3기',
    desc: '사람들의 마음을 움직이는 콘텐츠 마케터 커리어 시작!',
    date: '12/29',
    thumbnail: '/images/mid-banner/banner-marketing.png',
    href: '/',
  },
]

export default function MidBanner() {
  return (
    <div className="mx-auto mt-6 w-full max-w-7xl rounded-3xl border border-white/10 bg-white/40 p-6 shadow-xl backdrop-blur-xl">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.map((item, idx) => (
          <Link href={item.href} key={idx} className="block">
            <div className="flex h-[190px] items-center justify-between rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
              <div className="flex min-w-0 flex-col">
                <div className="font-semibold text-orange-600">{item.academy}</div>
                <div>
                  <div className="mt-1 truncate text-lg font-bold">{item.title}</div>
                  <div className="mt-1 truncate rounded-xl bg-gray-100 px-3 py-2 pr-4 text-sm">{item.desc}</div>
                </div>
                <div className="mt-1 text-sm text-gray-600">{item.date} 개강 · 무료</div>
              </div>

              {/* 오른쪽 이미지 */}
              <Image
                src={item.thumbnail}
                width={95}
                height={95}
                alt=""
                className="h-[95px] w-[95px] shrink-0 rounded-xl object-cover"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* 작은 배너 */}
      <SmallBanner />
    </div>
  )
}
