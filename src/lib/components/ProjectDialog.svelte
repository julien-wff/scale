<script lang="ts">
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import { Badge } from '$lib/components/ui/badge';
    import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { Progress } from '$lib/components/ui/progress';
    import { Separator } from '$lib/components/ui/separator';
    import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
    import FileText from '@lucide/svelte/icons/file-text';
    import Building2 from '@lucide/svelte/icons/building-2';
    import Calendar from '@lucide/svelte/icons/calendar';
    import Clock from '@lucide/svelte/icons/clock';
    import MapPin from '@lucide/svelte/icons/map-pin';
    import AlertCircle from '@lucide/svelte/icons/alert-circle';
    import type { ApiProject } from '$lib/types';

    interface Props {
        open: boolean;
        project: ApiProject | null;
    }

    let { open = $bindable(false), project }: Props = $props();

    const meta = $derived(project?.project_meta ?? null);
    const technologies = $derived(meta?.metrics?.technical?.technologies ?? []);
    const longSections = $derived(
        [
            { title: 'Context & Objectives', value: meta?.long_description?.context_and_objectives },
            { title: 'Results & Impact', value: meta?.long_description?.results_and_impact },
            { title: 'Additional Details', value: meta?.long_description?.additional_details },
        ].filter(section => Boolean(section.value)),
    );

    const temperatureBars = $derived([
        {
            key: 'geolocation',
            label: 'Geographic',
            value: clamp(Number(meta?.temperatures?.sub_temperatures?.geolocation ?? 0)),
            gradient: 'from-sky-500 to-sky-300',
        },
        {
            key: 'technical',
            label: 'Technical',
            value: clamp(Number(meta?.temperatures?.sub_temperatures?.technical ?? 0)),
            gradient: 'from-violet-500 to-violet-300',
        },
        {
            key: 'time',
            label: 'Timing',
            value: clamp(Number(meta?.temperatures?.sub_temperatures?.time ?? 0)),
            gradient: 'from-amber-500 to-amber-300',
        },
        {
            key: 'budget',
            label: 'Budget',
            value: clamp(Number(meta?.temperatures?.sub_temperatures?.budget ?? 0)),
            gradient: 'from-emerald-500 to-emerald-300',
        },
    ]);

    const globalTemperature = $derived(clamp(Number(meta?.temperatures?.global_temperature ?? 0)));
    const recommendation = $derived(meta?.temperatures?.recommendation ?? null);
    const createdAt = $derived(formatDate(project?.createdAt));
    const updatedAt = $derived(formatDate(project?.updatedAt));

    function clamp(value: number, min = 0, max = 100) {
        const safe = Number.isFinite(value) ? value : 0;
        return Math.max(min, Math.min(max, safe));
    }

    function formatDate(value?: string) {
        if (!value) return null;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return null;
        return new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Content maxWidth class="max-w-7xl max-h-[calc(100vh-8rem)] overflow-y-auto">
        {#if meta}
            <div class="flex flex-col gap-8">
                <header class="flex flex-col gap-6">
                    <div class="flex flex-col gap-2">
                        <Dialog.Title class="text-3xl font-semibold leading-tight tracking-tight">
                            {meta.title ?? 'Untitled project'}
                        </Dialog.Title>
                        <div class="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                            {#if meta.company_name}
                                <span class="flex items-center gap-2">
                                    <Building2 class="size-4" />
                                    <span class="font-medium text-foreground">{meta.company_name}</span>
                                </span>
                            {/if}
                            {#if project?.original_file_name}
                                <span class="flex items-center gap-2">
                                    <FileText class="size-4" />
                                    <span>{project.original_file_name}.pdf</span>
                                </span>
                            {/if}
                            {#if createdAt}
                                <span class="flex items-center gap-2">
                                    <Calendar class="size-4" />
                                    <span class="uppercase tracking-wide text-xs text-muted-foreground">Created {createdAt}</span>
                                </span>
                            {/if}
                            {#if updatedAt}
                                <span class="flex items-center gap-2">
                                    <Clock class="size-4" />
                                    <span class="uppercase tracking-wide text-xs text-muted-foreground">Updated {updatedAt}</span>
                                </span>
                            {/if}
                        </div>
                    </div>
                </header>

                <div class="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                    <section class="space-y-8">
                        {#if longSections.length}
                            <ScrollArea class="max-h-[65vh] pr-4">
                                <div class="space-y-6">
                                    {#if meta.short_description}
                                        <article>
                                            <h3 class="font-semibold uppercase tracking-wider text-foreground mb-2">Overview</h3>
                                            <p class="text-base leading-relaxed text-muted-foreground mb-4">
                                                {meta.short_description}
                                            </p>
                                        </article>
                                    {/if}

                                    {#each longSections as section}
                                        <article>
                                            <h3 class="font-semibold uppercase tracking-wider text-foreground mb-2">
                                                {section.title}
                                            </h3>
                                            <p class="text-base leading-relaxed text-muted-foreground mb-4">
                                                {section.value}
                                            </p>
                                        </article>
                                    {/each}
                                </div>
                            </ScrollArea>
                        {:else}
                            <div class="flex h-full min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/30 px-6 text-sm text-muted-foreground">
                                No detailed narrative provided.
                            </div>
                        {/if}
                    </section>

                    <aside class="flex flex-col gap-5">
                        <Card class="border-muted/40 shadow-sm">
                            <CardHeader class="space-y-3 pb-4">
                                <div class="flex items-center justify-between">
                                    <CardTitle class="text-lg">Temperatures</CardTitle>
                                    {#if recommendation}
                                        <Badge variant="outline" class="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide">
                                            {recommendation}
                                        </Badge>
                                    {/if}
                                </div>
                                <p class="text-xs text-muted-foreground">Four pillars reflect prioritisation signals for this opportunity.</p>
                            </CardHeader>
                            <CardContent class="space-y-5">
                                <div class="flex items-end justify-between gap-5">
                                    {#each temperatureBars as bar}
                                        <div class="flex flex-col items-center gap-2 text-center text-sm">
                                            <div class="relative h-32 w-7 overflow-hidden rounded-full bg-muted/70 shadow-inner">
                                                <div class={`absolute left-1 right-1 bottom-1 rounded-full bg-linear-to-t ${bar.gradient}`} style={`height: calc(${bar.value * 4}% - .5rem)`}></div>
                                            </div>
                                            <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{bar.label}</span>
                                            <span class="text-xs font-semibold tabular-nums text-foreground">{bar.value}°</span>
                                        </div>
                                    {/each}
                                </div>
                                <Separator />
                                <div class="flex flex-col gap-2">
                                    <div class="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                                        <span>Global priority</span>
                                        <span>{globalTemperature}%</span>
                                    </div>
                                    <Progress value={globalTemperature} class="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card class="border-muted/40 shadow-sm">
                            <CardHeader class="space-y-2 pb-2">
                                <CardTitle class="text-lg">Key Metrics</CardTitle>
                            </CardHeader>
                            <CardContent class="space-y-3 text-sm">
                                {#if meta.metrics?.geolocalisation?.location}
                                    <div class="flex items-start gap-2">
                                        <MapPin class="mt-0.5 size-4 text-muted-foreground" />
                                        <div>
                                            <p class="font-medium">Location</p>
                                            <p class="text-muted-foreground">
                                                {meta.metrics.geolocalisation.location}
                                                {#if meta.metrics.geolocalisation.type}
                                                    &nbsp;• {meta.metrics.geolocalisation.type}
                                                {/if}
                                            </p>
                                            {#if meta.metrics.geolocalisation.logistics_details}
                                                <p class="text-xs text-muted-foreground">
                                                    {meta.metrics.geolocalisation.logistics_details}
                                                </p>
                                            {/if}
                                        </div>
                                    </div>
                                {/if}

                                {#if meta.metrics?.time?.start_date || meta.metrics?.time?.duration}
                                    <div class="flex items-start gap-2">
                                        <Calendar class="mt-0.5 size-4 text-muted-foreground" />
                                        <div>
                                            <p class="font-medium">Timeline</p>
                                            <p class="text-muted-foreground">
                                                {#if meta.metrics?.time?.start_date}
                                                    Start {meta.metrics.time.start_date}
                                                {/if}
                                                {#if meta.metrics?.time?.duration}
                                                    {#if meta.metrics?.time?.start_date}
                                                        ,
                                                    {/if}
                                                    Duration {meta.metrics.time.duration}
                                                {/if}
                                            </p>
                                            {#if meta.metrics?.time?.urgency}
                                                <p class="text-xs text-muted-foreground">Urgency: {meta.metrics.time.urgency}</p>
                                            {/if}
                                        </div>
                                    </div>
                                {/if}

                                {#if meta.metrics?.technical?.expertise_level || meta.metrics?.technical?.number_of_positions}
                                    <div class="flex items-start gap-2">
                                        <AlertCircle class="mt-0.5 size-4 text-muted-foreground" />
                                        <div>
                                            <p class="font-medium">Profile</p>
                                            <p class="text-muted-foreground">
                                                {#if meta.metrics?.technical?.expertise_level}
                                                    Level {meta.metrics.technical.expertise_level}
                                                {/if}
                                                {#if meta.metrics?.technical?.number_of_positions}
                                                    {#if meta.metrics?.technical?.expertise_level}
                                                        &nbsp;•
                                                    {/if}
                                                    {meta.metrics.technical.number_of_positions}
                                                    {meta.metrics.technical.number_of_positions === 1 ? 'position' : 'positions'}
                                                {/if}
                                            </p>
                                            {#if meta.metrics?.technical?.internal_fit}
                                                <p class="text-xs text-muted-foreground">Internal fit: {meta.metrics.technical.internal_fit}</p>
                                            {/if}
                                        </div>
                                    </div>
                                {/if}

                                {#if meta.metrics?.budget_previsions}
                                    <div class="flex items-start gap-2">
                                        <FileText class="mt-0.5 size-4 text-muted-foreground" />
                                        <div>
                                            <p class="font-medium">Budget Insights</p>
                                            <pre class="whitespace-pre-wrap rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">{JSON.stringify(
                                                    meta.metrics.budget_previsions,
                                                    null,
                                                    2,
                                                )}</pre>
                                        </div>
                                    </div>
                                {/if}
                            </CardContent>
                        </Card>

                        {#if technologies.length}
                            <Card class="border-muted/40 shadow-sm">
                                <CardHeader class="pb-2">
                                    <CardTitle class="text-lg">Technologies</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div class="flex flex-wrap gap-2">
                                        {#each technologies as tech}
                                            <Badge variant="secondary" class="rounded-full px-3 py-1 text-xs uppercase tracking-wide">
                                                {tech}
                                            </Badge>
                                        {/each}
                                    </div>
                                </CardContent>
                            </Card>
                        {/if}
                    </aside>
                </div>
            </div>
        {:else}
            <div class="flex h-40 items-center justify-center text-sm text-muted-foreground">No project selected.</div>
        {/if}
    </Dialog.Content>
</Dialog.Root>
