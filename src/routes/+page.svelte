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
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { fade } from 'svelte/transition';
    import ProjectDialog from '$lib/components/ProjectDialog.svelte';

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

    onMount(async () => {
        projects = await fetchProjects();
        loading = false;
    });

    async function handleRefresh() {
        refreshing = true;
        projects = await fetchProjects();
        refreshing = false;
    }

    function filtered(): ApiProject[] {
        return projects.filter(({ project_meta: p, project_state: state }: ApiProject) => {
            if (!p || state !== 'PROCESSED') return false;

            const tags = p.metrics?.technical?.technologies || [];
            const matchQ = !q || [p.title, p.long_description, ...tags].filter(Boolean).join(' ').toLowerCase().includes(q.toLowerCase());
            const matchTech = !tech || tags.includes(tech);
            const matchTemp = (p.temperatures?.global_temperature ?? 0) >= minTemp && (p.temperatures?.global_temperature ?? 0) <= maxTemp;
            return matchQ && matchTech && matchTemp;
        });
    }
</script>

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
        <div class="flex h-14 items-center gap-3 border-b px-4">
            <SidebarTrigger />
            <h1 class="text-xl font-semibold">Opportunities</h1>
            <div class="ml-auto">
                <Button variant="secondary" onclick={handleRefresh} disabled={refreshing} class="mr-1">
                    <div class:animate-spin={refreshing}>
                        <RefreshCw class="size-4" />
                    </div>
                    Refresh
                </Button>
                <Sheet.Root>
                    <Sheet.Trigger>
                        <Button class="gap-2">
                            <Plus class="size-4" />
                            Add project
                        </Button>
                    </Sheet.Trigger>

                    <UploadSidebar onUpload={handleRefresh} {projects} />
                </Sheet.Root>
            </div>
        </div>

        <!-- Content -->
        <div class="p-4 pb-0">
            <ScrollArea class="h-[calc(100vh-var(--spacing)*18)]">
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

<ProjectDialog bind:open={dialogOpened} project={selectedProject} />
