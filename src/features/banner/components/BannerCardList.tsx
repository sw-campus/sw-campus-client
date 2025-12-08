import Image from 'next/image'

const data = [
  {
    academy: '멋쟁이사자처럼',
    title: '유니티 게임 개발 7기',
    desc: '상상하던 게임을 실제로 개발하는 부트캠프에 합류해요🔥',
    date: '12/30 개강 · 무료',
    thumbnail: '/images/mid-banner/banner-unity.png',
  },
  {
    academy: '내일배움캠프',
    title: '콘텐츠 마케터 부트캠프 3기',
    desc: '사람들의 마음을 움직이는 콘텐츠 마케터 커리어 시작!',
    date: '12/29 개강 · 무료',
    thumbnail: '/images/mid-banner/banner-marketing.png',
  },
]

export default function BootcampCardList() {
  return (
    <div className="mx-auto mt-6 w-full max-w-7xl rounded-3xl border border-white/10 bg-white/40 p-6 shadow-xl backdrop-blur-xl">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-orange-600">{item.academy}</div>
              <div className="text-lg font-bold">{item.title}</div>
              <div className="rounded-xl bg-gray-100 px-3 py-1 text-sm">{item.desc}</div>
            </div>

            <Image src={item.thumbnail} width={80} height={80} alt="" className="rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
