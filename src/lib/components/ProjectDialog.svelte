<script lang="ts">
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import { Badge } from '$lib/components/ui/badge';
    import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
    import FileText from '@lucide/svelte/icons/file-text';
    import Building2 from '@lucide/svelte/icons/building-2';
    import Calendar from '@lucide/svelte/icons/calendar';
    import Clock from '@lucide/svelte/icons/clock';
    import MapPin from '@lucide/svelte/icons/map-pin';
    import AlertCircle from '@lucide/svelte/icons/alert-circle';
    import type { ApiProject } from '$lib/types';
    import GradientBackground from '$lib/components/GradientBackground.svelte';
    import { API_URL } from '$lib/api';
    import DeleteProjectConfirmAlert from './DeleteProjectConfirmAlert.svelte';

    interface Props {
        open: boolean;
        project: ApiProject | null;
        onrefresh?: () => Promise<void>;
    }

    let { open = $bindable(false), project, onrefresh: handleRefresh }: Props = $props();

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
            key: 'budget',
            label: 'Budget',
            value: clamp(Number(meta?.temperatures?.sub_temperatures?.budget ?? 0), 0, 25),
            gradient: 'from-emerald-500 to-emerald-300',
        },
        {
            key: 'technical',
            label: 'Technical',
            value: clamp(Number(meta?.temperatures?.sub_temperatures?.technical ?? 0), 0, 25),
            gradient: 'from-violet-500 to-violet-300',
        },
        {
            key: 'time',
            label: 'Timing',
            value: clamp(Number(meta?.temperatures?.sub_temperatures?.time ?? 0), 0, 25),
            gradient: 'from-amber-500 to-amber-300',
        },
        {
            key: 'geolocation',
            label: 'Geographic',
            value: clamp(Number(meta?.temperatures?.sub_temperatures?.geolocation ?? 0), 0, 25),
            gradient: 'from-sky-500 to-sky-300',
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

    function formatCurrency(value: number | null | undefined, currency = 'EUR') {
        if (value == null) return 'N/A';

        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency,
            maximumFractionDigits: 0,
        }).format(value);
    }

    let deletePopupOpen = $state(false);

    function handlePageKeyPress(event: KeyboardEvent) {
        if (event.key === 'Delete') {
            deletePopupOpen = true;
        }
    }

    function handleDelete() {
        open = false;
        handleRefresh?.();
    }
</script>

<svelte:window on:keydown={handlePageKeyPress} />

<Dialog.Root bind:open>
    <Dialog.Content maxWidth class="max-w-7xl max-h-[calc(100vh-8rem)] overflow-y-auto">
        <GradientBackground />
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
                                    <span>{meta.company_name}</span>
                                </span>
                            {/if}
                            {#if project?.original_file_name}
                                <a class="flex items-center gap-2 underline" href="{API_URL}/pdf?id={project.project_id}" target="_blank" tabindex="-1">
                                    <FileText class="size-4" />
                                    <span>{project.original_file_name}.pdf</span>
                                </a>
                            {/if}
                            {#if createdAt}
                                <span class="flex items-center gap-2">
                                    <Calendar class="size-4" />
                                    <span class="tracking-wide text-xs text-muted-foreground">Created {createdAt}</span>
                                </span>
                            {/if}
                            {#if updatedAt}
                                <span class="flex items-center gap-2">
                                    <Clock class="size-4" />
                                    <span class="tracking-wide text-xs text-muted-foreground">Updated {updatedAt}</span>
                                </span>
                            {/if}
                        </div>
                    </div>
                </header>

                <div class="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <section class="space-y-8">
                        {#if longSections.length}
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

                                {#if technologies.length}
                                    <div>
                                        <h3 class="font-semibold uppercase tracking-wider text-foreground mb-2">Technologies</h3>
                                        <div class="flex flex-wrap gap-2">
                                            {#each technologies as tech}
                                                <Badge variant="colored" class="rounded-full px-3 py-1 text-xs capitalize tracking-wide">
                                                    {tech}
                                                </Badge>
                                            {/each}
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        {:else}
                            <div class="flex h-full min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/30 px-6 text-sm text-muted-foreground">
                                No detailed narrative provided.
                            </div>
                        {/if}
                    </section>

                    <aside class="flex flex-col gap-5">
                        <Card class="border-muted/40 shadow-sm">
                            <CardHeader class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <CardTitle class="text-lg">Temperatures</CardTitle>
                                    {#if recommendation}
                                        <Badge variant="outline" class="rounded-full px-3 py-1 text-xs font-medium tracking-wide">
                                            {recommendation} ({globalTemperature}°)
                                        </Badge>
                                    {/if}
                                </div>
                            </CardHeader>
                            <CardContent class="space-y-5">
                                <div class="grid grid-cols-4 items-end justify-between gap-5">
                                    {#each temperatureBars as bar}
                                        <div class="flex flex-col items-center text-center text-sm">
                                            <div class="relative h-32 w-7 overflow-hidden rounded-full bg-muted/70 shadow-inner mb-2">
                                                <div class={`absolute left-1 right-1 bottom-1 rounded-full bg-linear-to-t ${bar.gradient}`} style={`height: calc(${bar.value * 4}% - .5rem)`}></div>
                                            </div>
                                            <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">{bar.label}</span>
                                            <span class="text-xs font-semibold tabular-nums text-foreground">{bar.value}°</span>
                                        </div>
                                    {/each}
                                </div>
                            </CardContent>
                        </Card>

                        <Card class="border-muted/40 shadow-sm">
                            <CardHeader class="space-y-2">
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
                                                    <span class="capitalize">
                                                        &nbsp;• {meta.metrics.geolocalisation.type}
                                                    </span>
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
                                                <p class="text-xs text-muted-foreground">
                                                    Urgency: {meta.metrics.time.urgency}
                                                </p>
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

                                {#if meta.budget}
                                    <div class="flex items-start gap-2">
                                        <FileText class="mt-0.5 size-4 text-muted-foreground" />
                                        <div>
                                            <p class="font-medium">Budget Insights</p>
                                            <p class="text-muted-foreground">
                                                Billed: {formatCurrency(meta.budget.billing.total_billing)}
                                                ({meta.budget.billing.total_days} days)
                                            </p>
                                            <p class="text-muted-foreground">
                                                Costs: {formatCurrency(meta.budget.costs.total_costs)}
                                            </p>
                                            <p class="text-muted-foreground">
                                                Margins: {formatCurrency(meta.budget.profitability.gross_margin)}
                                                gross, {formatCurrency(meta.budget.profitability.net_margin)} net
                                            </p>
                                        </div>
                                    </div>
                                {/if}
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        {:else}
            <div class="flex h-40 items-center justify-center text-sm text-muted-foreground">No project selected.</div>
        {/if}
    </Dialog.Content>
</Dialog.Root>

<DeleteProjectConfirmAlert bind:open={deletePopupOpen} projectId={project?.project_id} ondelete={handleDelete} />
