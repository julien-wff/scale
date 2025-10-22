import { browser } from '$app/environment';
import { env as publicEnv } from '$env/dynamic/public';
import type { Project } from './types';

const BASE = publicEnv.PUBLIC_API_URL?.replace(/\/$/, '') || '';

export async function fetchProjects(fetchFn: typeof fetch = fetch): Promise<Project[]> {
    // When no API URL is provided, fall back to a local mock for dev preview
    const url = BASE ? `${BASE}/projects` : '/mock/projects.json';
    const res = await fetchFn(url, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`Failed to fetch projects (${res.status})`);
    const data = await res.json();
    // API might return { items: Project[] } or Project[]
    if (Array.isArray(data)) return data as Project[];
    if (Array.isArray(data?.items)) return data.items as Project[];
    // If the API returns just one project for demo, wrap it
    return [data as Project];
}

export async function uploadProject(file: File, fetchFn: typeof fetch = fetch): Promise<Project> {
    if (!BASE) throw new Error('PUBLIC_API_URL is not set. Cannot upload.');
    const form = new FormData();
    form.set('file', file, file.name);
    const res = await fetchFn(`${BASE}/projects/upload`, {
        method: 'POST',
        body: form,
    });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
    return res.json();
}

export function getApiBase() {
    return BASE;
}
