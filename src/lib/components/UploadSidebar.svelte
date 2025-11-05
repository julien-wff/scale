<script lang="ts">
    import {Button} from '$lib/components/ui/button';
    import {SheetContent, SheetHeader, SheetTitle} from '$lib/components/ui/sheet';
    import {uploadProject} from '$lib/api';
    import Upload from '@lucide/svelte/icons/upload';
    import type {ApiProject} from '$lib/types';
    import ProcessingCard from './upload-sidebar/ProcessingCard.svelte';

    interface Props {
        onUpload?: () => void;
        projects: ApiProject[];
    }

    let {onUpload, projects}: Props = $props();

    const processingProjects = $derived(projects.filter(p => p.project_state === 'PROCESSING'));

    // Upload
    let file: File | null = $state(null);

    async function handleUpload() {
        if (!file) return;
        try {
            await uploadProject(file);
            file = null;
            onUpload?.();
        } catch (e) {
            console.error(e);
            alert('Upload failed. Check API URL.');
        }
    }
</script>

<SheetContent class="w-96">
    <SheetHeader>
        <SheetTitle>Upload project PDF</SheetTitle>
    </SheetHeader>

    <div class="grid flex-1 auto-rows-min gap-6 px-4">
        <div class="flex flex-col gap-2">
            <label
                    for="file-input"
                    class="cursor-pointer inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
                <Upload class="size-4"/>
                {#if file}
                    <span class="text-sm text-muted-foreground">{file.name}</span>
                {:else}
                    <span>Select PDF file</span>
                {/if}
            </label>
            <input
                    id="file-input"
                    type="file"
                    accept="application/pdf"
                    class="hidden"
                    onchange={e => {
            const t = e.target as HTMLInputElement;
            file = t.files?.[0] ?? null;
        }}
            />

            <Button class="gap-2" onclick={handleUpload} disabled={!file}>
                <Upload class="size-4"/>
                Upload
            </Button>
            <p class="text-xs text-muted-foreground">The backend will scan the PDF and return a project.</p>
        </div>

        {#if processingProjects.length > 0}
            <div class="grid gap-2">
                <h3 class="font-medium">Processing projects...</h3>
                {#each processingProjects as project}
                    <ProcessingCard {project}/>
                {/each}
            </div>
        {/if}
    </div>
</SheetContent>
