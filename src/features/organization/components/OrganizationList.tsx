"use client";

import { FiSearch } from "react-icons/fi";
import { MOCK_ORGS } from "../api/mockOrganizations";
import { OrganizationCard } from "./OrganizationCard";

export function OrganizationList() {
    return (
        <div className="w-full pb-20 pt-10">
            {/* Header Section */}
            <div className="mb-8 flex flex-col gap-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold text-foreground">
                        {MOCK_ORGS.length}곳의 훈련기관을 찾았어요.
                    </h2>
                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="검색"
                            className="w-full rounded-full border border-border bg-card/50 px-4 py-3 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground" />
                    </div>
                </div>

            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {MOCK_ORGS.map((org) => (
                    <OrganizationCard key={org.id} organization={org} />
                ))}
            </div>
        </div>
    );
}
