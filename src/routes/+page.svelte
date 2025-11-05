<script lang="ts">
    import UploadSidebar from '$lib/components/UploadSidebar.svelte';
    import { SidebarProvider, SidebarInset, SidebarTrigger } from '$lib/components/ui/sidebar';
    import AppSidebar from '$lib/components/AppSidebar.svelte';
    import { Button } from '$lib/components/ui/button';
    import * as Sheet from '$lib/components/ui/sheet';
    import { ScrollArea } from '$lib/components/ui/scroll-area';
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import { toListItem, type ApiProject } from '$lib/types';
    import { fetchProjects } from '$lib/api';
    import Plus from '@lucide/svelte/icons/plus';
    import LoaderCircle from '@lucide/svelte/icons/loader-circle';
    import RefreshCw from '@lucide/svelte/icons/refresh-cw';
    import Thermometer from '@lucide/svelte/icons/thermometer';
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { fade } from 'svelte/transition';
    import ProjectDialog from '$lib/components/ProjectDialog.svelte';
    import GradientBackground from '$lib/components/GradientBackground.svelte';
    import { dev } from '$app/environment';

    let projects: ApiProject[] = $state([]);
    let loading = $state(true);
    let refreshing = $state(false);

    let dialogOpened = $state(false);
    let selectedProject = $state<ApiProject | null>(null);

    function handleOpenDialog(project: ApiProject) {
        selectedProject = project;
        dialogOpened = true;
    }

    // Filters/search
    let q = $state('');
    let tech = $state('');
    let minTemp = $state(0);
    let maxTemp = $state(100);

    // Reactive array of processing projects
    const processingProjects = $derived(projects.filter(p => p.project_state === 'PROCESSING'));

    // Sorting
    let sortOrder = $state<'asc' | 'desc'>('desc'); // default: highest temperature first

    let uploadSheetOpen = $state(false);

    onMount(async () => {
        projects = await fetchProjects();
        loading = false;
    });

    onMount(() => {
        const interval = setInterval(async () => {
            if (projects.some(p => p.project_state === 'PROCESSING') && !refreshing && !loading) {
                await handleRefresh();
            }
        }, 2000);

        return () => clearInterval(interval);
    });

    // Revalidate the whole page data every minute
    // If a validation is skipped because the tab is in the background, it will revalidate when the tab is back in focus
    let reloadSkipped = $state(false);

    onMount(() => {
        const reloadInterval = setInterval(() => {
            if (!document.hidden) {
                handleRefresh();
            } else {
                reloadSkipped = true;
            }
        }, 1000 * 60);

        return () => clearInterval(reloadInterval);
    });

    function handleVisibilityChange() {
        if (!document.hidden && reloadSkipped) {
            reloadSkipped = false;
            handleRefresh();
        }
    }

    async function handleRefresh() {
        refreshing = true;
        projects = await fetchProjects();
        refreshing = false;
    }

    function filtered(): ApiProject[] {
        return projects
            .filter(({ project_meta: p, project_state: state }: ApiProject) => {
                if (!p || state !== 'PROCESSED') return false;

                const tags = p.metrics?.technical?.technologies || [];
                const temp = p.temperatures?.global_temperature ?? 0;

                const matchQ = !q || [p.title, p.long_description, ...tags].filter(Boolean).join(' ').toLowerCase().includes(q.toLowerCase());

                const matchTech = !tech || tags.includes(tech);
                const matchTemp = temp >= minTemp && temp <= maxTemp;

                return matchQ && matchTech && matchTemp;
            })
            .sort((a, b) => {
                const tempA = a.project_meta?.temperatures?.global_temperature ?? 0;
                const tempB = b.project_meta?.temperatures?.global_temperature ?? 0;
                return sortOrder === 'asc' ? tempA - tempB : tempB - tempA;
            });
    }
</script>

<svelte:document onvisibilitychange={handleVisibilityChange} />

<SidebarProvider>
    <AppSidebar
        {q}
        onSearch={(v: string) => (q = v)}
        techs={Array.from(new Set(projects.flatMap((p: ApiProject) => p.project_meta?.metrics?.technical?.technologies ?? [])))}
        onTechChange={(v: string) => (tech = v)}
        selectedTech={tech}
    />

    <SidebarInset>
        <!-- Top bar -->
        <div class="flex h-14 items-center gap-3 border-b px-4 z-20">
            <SidebarTrigger />
            <h1 class="text-xl font-semibold">Opportunities</h1>

            <div class="ml-auto flex items-center gap-2">
                <Button variant="outlined" onclick={() => (sortOrder = sortOrder === 'asc' ? 'desc' : 'asc')} class="gap-1">
                    <Thermometer class="size-4" />
                    {sortOrder === 'asc' ? 'High ← Low' : 'High → Low'}
                </Button>

                <!-- Refresh Button -->
                {#if dev}
                    <Button variant="outlined" onclick={handleRefresh} disabled={refreshing}>
                        <div class:animate-spin={refreshing}>
                            <RefreshCw class="size-4" />
                        </div>
                        Refresh
                    </Button>
                {/if}

                <Sheet.Root bind:open={uploadSheetOpen}>
                    <Sheet.Trigger>
                        <Button class="gap-2 relative">
                            <Plus class="size-4" />
                            Add project
                            {#if processingProjects.length > 0}
                                <span
                                    class="absolute w-5.5 h-5.5 -top-2 -right-2 inline-flex items-center justify-centertext-xs font-semibold text-white bg-gray-800/60 backdrop-blur-sm border border-white/25 rounded-full shadow-md justify-center"
                                >
                                    {processingProjects.length}
                                </span>
                            {/if}
                        </Button>
                    </Sheet.Trigger>

                    <UploadSidebar onUpload={handleRefresh} {projects} visible={uploadSheetOpen} />
                </Sheet.Root>
            </div>
        </div>

        <!-- Content -->
        <div class="p-4 pb-0 z-10">
            <ScrollArea class="h-[calc(100vh-var(--spacing)*18)]">
                <GradientBackground />

                <div class="grid gap-3 pb-4">
                    {#each filtered() as p (p.id)}
                        <div animate:flip={{ duration: 200 }} transition:fade={{ duration: 200 }}>
                            <ProjectCard item={toListItem(p.project_meta!)} onClick={() => handleOpenDialog(p)} />
                        </div>
                    {/each}

                    {#if filtered().length === 0 && !loading}
                        <p class="text-sm text-muted-foreground">No projects match your filters.</p>
                    {/if}

                    {#if loading}
                        <div class="flex flex-col items-center justify-center gap-2 mt-10">
                            <LoaderCircle class="size-8 animate-spin" />
                        </div>
                    {/if}
                </div>
            </ScrollArea>
        </div>
    </SidebarInset>
</SidebarProvider>

<ProjectDialog bind:open={dialogOpened} project={selectedProject} onrefresh={handleRefresh} />
