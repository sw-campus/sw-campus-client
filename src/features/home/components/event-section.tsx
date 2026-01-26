import Image from 'next/image'
import Link from 'next/link'

const events = [
  { id: 1, imageUrl: '/images/events/6c14531cb87052cd8a8a2e2e11697c086d5fcd85.png', link: '' },
  { id: 2, imageUrl: '/images/events/f82d9596cf7d0efaa83d9b97becfcf70ea0fc421.png', link: '' },
]

export function EventSection() {
  return (
    <section className="flex flex-col gap-4 px-4 py-[30px] md:custom-container">
      {/* 섹션 헤더 */}
      <h2 className="text-center text-xl font-bold md:text-2xl">
        소프트웨어 캠퍼스에서
        <br />
        <span className="text-brand-gold">진행 중인 이벤트</span>를 확인해보세요.
      </h2>

      {/* 이벤트 목록 - 세로 배치 */}
      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <Link key={event.id} href={event.link} className="relative w-full overflow-hidden rounded-xl">
            <Image
              src={event.imageUrl}
              alt={`이벤트 ${event.id}`}
              width={800}
              height={400}
              className="h-auto w-full"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
