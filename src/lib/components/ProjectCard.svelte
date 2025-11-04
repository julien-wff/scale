<script lang="ts">
    import { Badge } from '$lib/components/ui/badge';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { Progress } from '$lib/components/ui/progress';
    import ScrollArea from './ui/scroll-area/scroll-area.svelte';
    import Thermometer from '@lucide/svelte/icons/thermometer';
    import Calendar from '@lucide/svelte/icons/calendar';
    import Clock from '@lucide/svelte/icons/clock';
    import type { ProjectListItem } from '$lib/types';

    interface Props {
        item: ProjectListItem;
        onClick?: () => void;
    }

    let { item, onClick }: Props = $props();

    const tags = $derived(item.tags ?? []);
</script>

<Card class="w-full overflow-hidden gap-4 cursor-pointer" onclick={onClick}>
    <CardHeader class="grid-rows-1">
        <div class="flex items-center justify-between gap-2">
            <div class="min-w-0">
                <CardTitle class="truncate h-5">{item.name}</CardTitle>
                {#if item.company}
                    <CardDescription class="truncate h-5">{item.company}</CardDescription>
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
        {#if tags.length}
            <ScrollArea orientation="horizontal">
                <div class="flex gap-1 pb-2">
                    {#each tags as t}
                        <Badge variant="secondary" class="rounded-md">{t}</Badge>
                    {/each}
                </div>
            </ScrollArea>
        {/if}

        {#if item.description}
            <p class="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
        {/if}
    </CardContent>

    <CardFooter class="flex items-center justify-between text-sm text-muted-foreground">
        <div class="flex items-center gap-4">
            {#if item.startDate}
                <div class="flex items-center gap-1 max-w-lg">
                    <Calendar class="size-4 shrink-0" />
                    <span class="line-clamp-1">Start: {item.startDate}</span>
                </div>
            {/if}
            {#if item.duration}
                <div class="flex items-center gap-1 max-w-lg">
                    <Clock class="size-4 shrink-0" />
                    <span class="line-clamp-1">Duration: {item.duration}</span>
                </div>
            {/if}
        </div>
    </CardFooter>
</Card>
