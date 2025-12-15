"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { OrganizationCard } from "./OrganizationCard";
import { useOrganizationsQuery } from "../hooks/useOrganizations";

export function OrganizationList() {
    const [searchTerm, setSearchTerm] = useState("");

    // API에서 기관 목록 조회 (서버 사이드 필터링)
    const { data: organizations = [], isLoading } = useOrganizationsQuery(searchTerm || undefined);

    return (
        <div className="w-full pb-20 pt-10">
            {/* Header Section */}
            <div className="mb-8 flex flex-col gap-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold text-foreground">
                        {organizations.length}곳의 훈련기관을 찾았어요.
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
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            )}

            {/* Grid Section or No Results */}
            {!isLoading && (
                organizations.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {organizations.map((org) => (
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
