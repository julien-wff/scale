<script lang="ts">
    import { Badge } from '$lib/components/ui/badge';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { Progress } from '$lib/components/ui/progress';
    import Thermometer from '@lucide/svelte/icons/thermometer';
    import Calendar from '@lucide/svelte/icons/calendar';
    import Clock from '@lucide/svelte/icons/clock';
    import type { ProjectListItem } from '$lib/types';

    let { item }: { item: ProjectListItem } = $props();
    const safeTags = (item.tags ?? []).slice(0, 5);
</script>

<Card class="w-full overflow-hidden">
    <CardHeader class="gap-1 pb-2">
        <div class="flex items-center justify-between gap-2">
            <div class="min-w-0">
                <CardTitle class="truncate">{item.name}</CardTitle>
                {#if item.company}
                    <CardDescription class="truncate">{item.company}</CardDescription>
                {/if}
            </div>

            <div class="flex items-center gap-2 shrink-0">
                <Thermometer class="size-4 text-muted-foreground" />
                <div class="flex items-center gap-2 min-w-28">
                    <Progress value={item.temperature} class="h-2 w-24" />
                    <span class="text-xs tabular-nums text-muted-foreground">{item.temperature}%</span>
                </div>
            </div>
        </div>
    </CardHeader>

    <CardContent class="pt-0">
        {#if safeTags.length}
            <div class="flex flex-wrap gap-1 mb-2">
                {#each safeTags as t}
                    <Badge variant="secondary" class="rounded-md">{t}</Badge>
                {/each}
                {#if (item.tags?.length ?? 0) > safeTags.length}
                    <Badge variant="outline">+{(item.tags?.length ?? 0) - safeTags.length}</Badge>
                {/if}
            </div>
        {/if}

        {#if item.description}
            <p class="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
        {/if}
    </CardContent>

    <CardFooter class="flex items-center justify-between text-sm text-muted-foreground">
        <div class="flex items-center gap-4">
            {#if item.startDate}
                <div class="flex items-center gap-1"><Calendar class="size-4" /> <span>Start: {item.startDate}</span></div>
            {/if}
            {#if item.duration}
                <div class="flex items-center gap-1"><Clock class="size-4" /> <span>Duration: {item.duration}</span></div>
            {/if}
        </div>
    </CardFooter>
</Card>
