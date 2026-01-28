interface HeroBannerProps {
  title: string
  description: string
  backgroundImageUrl?: string
}

export function HeroBanner({
  title,
  description,
  backgroundImageUrl = '/images/bootcamp-hero.jpg',
}: HeroBannerProps) {
  return (
    <div className="w-full md:max-w-[1448px] mx-auto md:px-6 md:pt-6">
      <div className="relative w-full h-[200px] md:h-[250px] overflow-hidden">
        {/* 배경 이미지 */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black/60" />
        {/* 콘텐츠 */}
        <div className="relative h-full px-4 py-2.5 flex flex-col items-center justify-center gap-2.5">
          <h1 className="text-white text-xl md:text-4xl font-bold">{title}</h1>
          <p className="text-white text-xs md:text-lg text-center max-w-[300px] md:max-w-[600px] whitespace-pre-line">{description}</p>
        </div>
      </div>
    </div>
  )
}
