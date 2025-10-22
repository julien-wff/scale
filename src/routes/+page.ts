import { fetchProjects } from '$lib/api';

export const load = async ({ fetch }: any) => {
    try {
        const projects = await fetchProjects(fetch);
        return { projects };
    } catch (e) {
        console.error('Failed to load projects', e);
        return { projects: [] };
    }
};
