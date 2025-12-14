"use client";

import { useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { OrganizationCard } from "./OrganizationCard";
import { useOrganizationsQuery } from "../hooks/useOrganizations";
import { MOCK_ORGS } from "../api/mockOrganizations";

export function OrganizationList() {
    const [searchTerm, setSearchTerm] = useState("");

    // API에서 기관 목록 조회 (실패시 mock 데이터 사용)
    const { data: apiData, isLoading, isError } = useOrganizationsQuery();

    // API 데이터가 있으면 사용, 없으면 mock 데이터 fallback
    const organizations = apiData ?? MOCK_ORGS;

    // 클라이언트 사이드 검색 필터링 (이름만)
    const filteredOrgs = useMemo(() => {
        if (!searchTerm) return organizations;
        return organizations.filter((org) =>
            org.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [organizations, searchTerm]);

    // 로딩 상태 (API 호출 중일 때도 mock 데이터를 보여줌)
    const showLoading = isLoading && !apiData;

    return (
        <div className="w-full pb-20 pt-10">
            {/* Header Section */}
            <div className="mb-8 flex flex-col gap-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold text-foreground">
                        {filteredOrgs.length}곳의 훈련기관을 찾았어요.
                    </h2>
                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="검색"
                            aria-label="훈련기관 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-full border border-border bg-card/50 px-4 py-3 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground" />
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {showLoading && (
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            )}

            {/* Grid Section or No Results */}
            {!showLoading && (
                filteredOrgs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredOrgs.map((org) => (
                            <OrganizationCard key={org.id} organization={org} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-muted-foreground">
                        <p className="text-lg">"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
                        <p className="mt-2 text-sm">다른 검색어로 시도해보세요.</p>
                    </div>
                )
            )}
        </div>
    );
}
