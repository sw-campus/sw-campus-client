export interface Organization {
    id: number;
    name: string;
    desc: string;  // Short description for list
    description?: string;  // Full description for detail
    activeCourseCount?: number;
    imageUrl?: string;  // Image for list card
    logoUrl?: string;  // Logo for detail page
    govAuth?: string;  // Government certification (e.g., "K-DIGITAL")
    facilityImageUrl?: string;
    facilityImageUrl2?: string;
    facilityImageUrl3?: string;
    facilityImageUrl4?: string;
}
