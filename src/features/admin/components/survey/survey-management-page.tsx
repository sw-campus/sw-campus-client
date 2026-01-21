'use client'

import { useState, useMemo } from 'react'

import { LuArchive, LuFilePenLine, LuList, LuSend } from 'react-icons/lu'

import { useQuestionSetsQuery } from '../../hooks/use-survey'
import type { AdminQuestionSet } from '../../types/survey.type'
import { SURVEY_STAT_COLORS, ColorfulStatCard } from '../common/colorful-stat-card'
import { QuestionSetCreateModal } from './question-set-create-modal'
import { QuestionSetDetailModal } from './question-set-detail-modal'
import { QuestionSetFilter } from './question-set-filter'
import { QuestionSetTable } from './question-set-table'

export function SurveyManagementPage() {
  const [keyword, setKeyword] = useState('')
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<AdminQuestionSet | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Fetch all question sets (APTITUDE only since BASIC is code-managed)
  const { data: questionSets, isLoading } = useQuestionSetsQuery()

  // Filter by keyword on client side
  const filteredQuestionSets = useMemo(() => {
    if (!questionSets) return []
    if (!keyword.trim()) return questionSets

    const lowerKeyword = keyword.toLowerCase()
    return questionSets.filter(
      qs =>
        qs.name.toLowerCase().includes(lowerKeyword) ||
        (qs.description && qs.description.toLowerCase().includes(lowerKeyword)),
    )
  }, [questionSets, keyword])

  // Calculate stats
  const stats = useMemo(() => {
    const all = questionSets || []
    return {
      total: all.length,
      draft: all.filter(qs => qs.status === 'DRAFT').length,
      published: all.filter(qs => qs.status === 'PUBLISHED').length,
      archived: all.filter(qs => qs.status === 'ARCHIVED').length,
    }
  }, [questionSets])

  const handleViewDetail = (questionSet: AdminQuestionSet) => {
    setSelectedQuestionSet(questionSet)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedQuestionSet(null)
  }

  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword)
  }

  const statCards = [
    { title: '전체', value: stats.total, icon: LuList, bgColor: SURVEY_STAT_COLORS.total },
    { title: '작성 중', value: stats.draft, icon: LuFilePenLine, bgColor: SURVEY_STAT_COLORS.draft },
    { title: '발행됨', value: stats.published, icon: LuSend, bgColor: SURVEY_STAT_COLORS.published },
    { title: '보관됨', value: stats.archived, icon: LuArchive, bgColor: SURVEY_STAT_COLORS.archived },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-2xl font-bold">성향 테스트 문항 관리</h1>
        <QuestionSetCreateModal />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map(stat => (
          <ColorfulStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* Filter */}
      <QuestionSetFilter keyword={keyword} onKeywordChange={handleKeywordChange} />

      {/* Table */}
      <QuestionSetTable
        questionSets={filteredQuestionSets}
        isLoading={isLoading}
        onViewDetail={handleViewDetail}
      />

      {/* Detail Modal */}
      <QuestionSetDetailModal
        questionSet={selectedQuestionSet}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  )
}
