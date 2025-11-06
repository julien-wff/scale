// Project from the API response (from DB)
export interface ApiProject {
    project_state: 'PROCESSING' | 'PROCESSED';
    project_id: string;
    project_meta: Project | null;
    original_file_name: string;
    id: number;
    createdAt: string;
    updatedAt: string;
}

// Derived from the sample project JSON attached in chat
export type Project = {
    projectId: string;
    filename?: string;
    title: string; // Project name
    managerId?: number;
    company_name: string;
    short_description?: string;
    long_description?: {
        context_and_objectives?: string;
        results_and_impact?: string;
        additional_details?: string;
    };
    metrics?: {
        geolocalisation?: {
            type?: string; // hybrid | onsite | remote
            location?: string;
            logistics_details?: string;
        };
        time?: {
            response_deadline: string;
            start_date: string;
            end_date_or_duration: string;
            urgency?: string | boolean;
        };
        technical?: {
            technologies?: string[];
            number_of_positions?: number;
            expertise_level?: string;
            internal_fit?: string;
        };
        budget_previsions?: unknown;
    };
    temperatures?: {
        sub_temperatures?: Record<string, number>;
        global_temperature?: number; // 0..100 priority
        recommendation?: string;
    };
    budget?: {
        billing: {
            total_billing: number;
            daily_rate_per_profile: number;
            total_days: number;
            number_of_profiles: number;
        };
        costs: {
            total_salary_costs: number;
            total_logistics_costs: number;
            total_overheads: number;
            risk_buffer: number;
            total_costs: number;
        };
        profitability: {
            gross_margin: number;
            net_margin: number;
            profitability_ratio: number;
        };
        break_even: boolean;
    };
    [key: string]: unknown;
};

// Flattened shape used by the UI list
export type ProjectListItem = {
    id: string;
    name: string;
    company: string;
    tags: string[];
    startDate?: string;
    duration?: string;
    description?: string;
    temperature: number; // 0..100
};

export function toListItem(p: Project): ProjectListItem {
    return {
        id: String(p.projectId ?? crypto.randomUUID()),
        name: p.title ?? 'Untitled',
        company: p.company_name,
        tags: p.metrics?.technical?.technologies ?? [],
        startDate: p.metrics?.time?.start_date,
        duration: p.metrics?.time?.end_date_or_duration,
        description: p.short_description ?? p.long_description?.context_and_objectives,
        temperature: clamp(Number(p.temperatures?.global_temperature ?? 0), 0, 100),
    };
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, isFinite(n) ? n : 0));
}
