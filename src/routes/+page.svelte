<script lang="ts">
    import { SidebarProvider, SidebarInset, SidebarTrigger } from '$lib/components/ui/sidebar';
    import AppSidebar from '$lib/components/AppSidebar.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '$lib/components/ui/sheet';
    import { ScrollArea } from '$lib/components/ui/scroll-area';
    import { Separator } from '$lib/components/ui/separator';
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import { toListItem, type Project, type ProjectListItem } from '$lib/types';
    import { uploadProject } from '$lib/api';
    import Plus from '@lucide/svelte/icons/plus';
    import Search from '@lucide/svelte/icons/search';
    import Upload from '@lucide/svelte/icons/upload';

    let { data } = $props<{ data: { projects: Project[] } }>();
    let projects: ProjectListItem[] = $state((data?.projects ?? []).map(toListItem));

    // Filters/search
    let q = $state('');
    let tech = $state('');
    let minTemp = $state(0);
    let maxTemp = $state(100);

    $effect(() => {
        projects = (data?.projects ?? []).map(toListItem);
    });

    function filtered(): ProjectListItem[] {
        return projects.filter((p: ProjectListItem) => {
            const matchQ = !q || [p.name, p.company, p.description, ...p.tags].filter(Boolean).join(' ').toLowerCase().includes(q.toLowerCase());
            const matchTech = !tech || p.tags.includes(tech);
            const matchTemp = p.temperature >= minTemp && p.temperature <= maxTemp;
            return matchQ && matchTech && matchTemp;
        });
    }

    // Upload
    let file: File | null = $state(null);
    async function onUpload() {
        if (!file) return;
        try {
            const created = await uploadProject(file);
            data.projects = [created, ...data.projects];
            projects = data.projects.map(toListItem);
            file = null;
            alert('Upload completed');
        } catch (e) {
            console.error(e);
            alert('Upload failed. Check API URL.');
        }
    }
</script>

<SidebarProvider>
    <AppSidebar {q} onSearch={(v: string) => (q = v)} techs={Array.from(new Set(projects.flatMap((p: ProjectListItem) => p.tags))) as string[]} onTechChange={(v: string) => (tech = v)} />
    <SidebarInset>
        <!-- Top bar -->
        <div class="flex h-14 items-center gap-3 border-b px-4">
            <SidebarTrigger />
            <h1 class="text-xl font-semibold">Opportunities</h1>
            <div class="ml-auto">
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
                            <Button class="gap-2" onclick={onUpload} disabled={!file}><Upload class="size-4" /> Upload</Button>
                            <p class="text-xs text-muted-foreground">The backend will scan the PDF and return a project.</p>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>

        <!-- Content -->
        <div class="p-4">
            <ScrollArea class="h-[calc(100vh-8rem)] pr-2">
                <div class="grid gap-3">
                    {#each filtered() as p (p.id)}
                        <ProjectCard item={p} />
                    {/each}

                    {#if filtered().length === 0}
                        <p class="text-sm text-muted-foreground">No projects match your filters.</p>
                    {/if}
                </div>
            </ScrollArea>
        </div>
    </SidebarInset>
</SidebarProvider>
