// Derived from the sample project JSON attached in chat
export type Project = {
    projectId: string;
    filename?: string;
    title: string; // Project name
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
            start_date?: string; // e.g., "ASAP"
            duration?: string; // e.g., "6 months" or a label
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
    budget?: unknown;
    [key: string]: unknown;
};

// Flattened shape used by the UI list
export type ProjectListItem = {
    id: string;
    name: string;
    company?: string;
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
        company: (p as any).company ?? undefined,
        tags: p.metrics?.technical?.technologies ?? [],
        startDate: p.metrics?.time?.start_date,
        duration: p.metrics?.time?.duration,
        description: p.short_description ?? p.long_description?.context_and_objectives,
        temperature: clamp(Number(p.temperatures?.global_temperature ?? 0), 0, 100),
    };
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, isFinite(n) ? n : 0));
}
