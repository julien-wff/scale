import { env as publicEnv } from '$env/dynamic/public';
import type { Project } from './types';

const API_URL = publicEnv.PUBLIC_API_URL?.replace(/\/$/, '') || '';

export async function fetchProjects(fetchFn: typeof fetch = fetch): Promise<Project[]> {
    const url = API_URL ? `${API_URL}/projects` : '/mock/projects.json';

    const res = await fetchFn(url, { headers: { accept: 'application/json' } });
    if (!res.ok) {
        throw new Error(`Failed to fetch projects (${res.status})`);
    }

    const data = await res.json();

    if (Array.isArray(data)) {
        return data as Project[];
    }

    if (Array.isArray(data?.items)) {
        return data.items as Project[];
    }

    return [data as Project];
}

export async function uploadProject(file: File, fetchFn: typeof fetch = fetch) {
    if (!API_URL) {
        throw new Error('PUBLIC_API_URL is not set. Cannot upload.');
    }

    const form = new FormData();
    form.set('data', file, file.name);

    const res = await fetchFn(`${API_URL}/upload`, {
        method: 'POST',
        body: form,
    });

    if (!res.ok) {
        throw new Error(`Upload failed (${res.status})`);
    }
}

export function getApiBase() {
    return API_URL;
}
