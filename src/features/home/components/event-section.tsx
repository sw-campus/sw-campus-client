import Image from 'next/image'
import Link from 'next/link'

const events = [
  { id: 1, imageUrl: '/images/events/6c14531cb87052cd8a8a2e2e11697c086d5fcd85.png', link: '' },
  { id: 2, imageUrl: '/images/events/f82d9596cf7d0efaa83d9b97becfcf70ea0fc421.png', link: '' },
]

export function EventSection() {
  return (
    <section className="flex flex-col gap-6 px-4 py-[30px] md:mx-auto md:w-full md:max-w-[1448px] md:gap-10 md:px-6 md:py-[50px]">
      {/* 섹션 헤더 */}
      <h2 className="text-center text-xl font-bold md:text-[32px]">
        소프트웨어 캠퍼스에서{' '}
        <br className="md:hidden" />
        <span className="text-brand-gold">진행 중인 이벤트</span>를 확인해보세요.
      </h2>

      {/* 이벤트 목록 */}
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        {events.map((event) => (
          <Link key={event.id} href={event.link} className="relative w-full overflow-hidden rounded-xl md:flex-1">
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
