interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Lecture 스키마 (강의 상세)
export interface LectureJsonLdData {
  name: string
  description?: string
  provider?: string
  url?: string
  image?: string
}

export function createLectureJsonLd(data: LectureJsonLdData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: data.name,
    description: data.description,
    provider: data.provider
      ? {
          '@type': 'Organization',
          name: data.provider,
        }
      : {
          '@type': 'Organization',
          name: '소프트웨어캠퍼스',
        },
    url: data.url,
    image: data.image,
  }
}

// Organization 스키마 (교육기관 상세)
export interface OrganizationJsonLdData {
  name: string
  description?: string
  url?: string
  logo?: string
}

export function createOrganizationJsonLd(data: OrganizationJsonLdData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    description: data.description,
    url: data.url,
    logo: data.logo,
  }
}

// Article 스키마 (커뮤니티 게시글)
export interface ArticleJsonLdData {
  headline: string
  description?: string
  author?: string
  datePublished?: string
  dateModified?: string
  url?: string
  image?: string
}

export function createArticleJsonLd(data: ArticleJsonLdData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    author: data.author
      ? {
          '@type': 'Person',
          name: data.author,
        }
      : undefined,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    url: data.url,
    image: data.image,
    publisher: {
      '@type': 'Organization',
      name: '소프트웨어캠퍼스',
    },
  }
}

// WebSite 스키마 (사이트 전체)
export function createWebsiteJsonLd(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '소프트웨어캠퍼스',
    url: baseUrl,
    description: '국비지원 IT 부트캠프 비교 플랫폼',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/lectures/search?text={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
