import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Organization } from '../types/organization.type';

interface OrganizationCardProps {
    organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
    return (
        <Link
            href={`/organization/${organization.id}`}
            className="group block"
        >
            <Card className="flex h-full flex-col items-center border-0 bg-card/40 p-5 text-center shadow-sm backdrop-blur-xl transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
                {/* Circular Logo with Ring */}
                <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-card shadow-sm ring-2 ring-border transition-all group-hover:ring-primary/30 group-hover:shadow-md">
                    {organization.imageUrl ? (
                        <img
                            src={organization.imageUrl}
                            alt={organization.name}
                            className="h-full w-full object-contain p-1"
                        />
                    ) : (
                        <span className="text-2xl">🏢</span>
                    )}
                </div>

                {/* Organization Name */}
                <h3 className="mb-1.5 text-base font-semibold text-foreground">
                    {organization.name}
                </h3>

                {/* Description */}
                <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {organization.desc}
                </p>

                {/* Recruiting Badge - Green semantic color */}
                {(organization.activeCourseCount ?? 0) > 0 && (
                    <span className="mt-auto inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-2.5 py-1 text-xs font-medium text-accent-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {organization.activeCourseCount}개 모집 중
                    </span>
                )}
            </Card>
        </Link>
    );
}
