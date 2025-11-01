<script lang="ts">
    import { SidebarProvider, SidebarInset, SidebarTrigger } from '$lib/components/ui/sidebar';
    import AppSidebar from '$lib/components/AppSidebar.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '$lib/components/ui/sheet';
    import { ScrollArea } from '$lib/components/ui/scroll-area';
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import { toListItem, type ApiProject } from '$lib/types';
    import { fetchProjects, uploadProject } from '$lib/api';
    import Plus from '@lucide/svelte/icons/plus';
    import LoaderCircle from '@lucide/svelte/icons/loader-circle';
    import Upload from '@lucide/svelte/icons/upload';
    import RefreshCw from '@lucide/svelte/icons/refresh-cw';
    import { onMount } from 'svelte';

    let projects: ApiProject[] = $state([]);
    let loading = $state(true);
    let refreshing = $state(false);

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
            const matchQ =
                !q ||
                [p.title, p.long_description, ...tags]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(q.toLowerCase());
            const matchTech = !tech || tags.includes(tech);
            const matchTemp =
                (p.temperatures?.global_temperature ?? 0) >= minTemp &&
                (p.temperatures?.global_temperature ?? 0) <= maxTemp;
            return matchQ && matchTech && matchTemp;
        });
    }

    // Upload
    let file: File | null = $state(null);
    async function onUpload() {
        if (!file) return;
        try {
            await uploadProject(file);
            file = null;
            alert('Upload completed');
        } catch (e) {
            console.error(e);
            alert('Upload failed. Check API URL.');
        }
    }
</script>

<SidebarProvider>
    <AppSidebar
        {q}
        onSearch={(v: string) => (q = v)}
        techs={Array.from(
            new Set(projects.flatMap((p: ApiProject) => p.project_meta?.metrics?.technical?.technologies ?? [])),
        )}
        onTechChange={(v: string) => (tech = v)}
    />
    <SidebarInset>
        <!-- Top bar -->
        <div class="flex h-14 items-center gap-3 border-b px-4">
            <SidebarTrigger />
            <h1 class="text-xl font-semibold">Opportunities</h1>
            <div class="ml-auto">
                <Button variant="secondary" onclick={handleRefresh} disabled={refreshing}>
                    <div class:animate-spin={refreshing}>
                        <RefreshCw class="size-4" />
                    </div>
                    Refresh
                </Button>
                <Sheet>
                    <SheetTrigger>
                        <Button class="gap-2">
                            <Plus class="size-4" />
                            Add project
                        </Button>
                    </SheetTrigger>
                    <SheetContent class="w-96">
                        <SheetHeader>
                            <SheetTitle>Upload project PDF</SheetTitle>
                        </SheetHeader>
                        <div class="mt-4 space-y-3">
                            <input
                                type="file"
                                accept="application/pdf"
                                onchange={e => {
                                    const t = e.target as HTMLInputElement;
                                    file = t.files?.[0] ?? null;
                                }}
                            />
                            <Button class="gap-2" onclick={onUpload} disabled={!file}>
                                <Upload class="size-4" />
                                Upload
                            </Button>
                            <p class="text-xs text-muted-foreground">
                                The backend will scan the PDF and return a project.
                            </p>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>

        <!-- Content -->
        <div class="p-4 pb-0">
            <ScrollArea class="h-[calc(100vh-var(--spacing)*18)]">
                <div class="grid gap-3 pb-4">
                    {#each filtered() as p (p.id)}
                        <ProjectCard item={toListItem(p.project_meta!)} />
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
