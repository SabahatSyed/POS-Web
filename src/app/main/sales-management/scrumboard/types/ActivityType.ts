/**
 * Activity Type
 */
export type ActivityType = {
    id: string;
    icon?: string;
    image?: string;
    description: string;
    date: number;
    type: string;
    extraContent?: string;
    linkedContent?: string;
    link?: string;
    useRouter?: boolean;
};

/**
 * Activities Type
 */
export type ActivitiesType = ActivityType[];