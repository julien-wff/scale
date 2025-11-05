<script lang="ts">
    import {Badge} from '$lib/components/ui/badge';
    import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '$lib/components/ui/card';
    import {Progress} from '$lib/components/ui/progress';
    import ScrollArea from './ui/scroll-area/scroll-area.svelte';
    import Thermometer from '@lucide/svelte/icons/thermometer';
    import Calendar from '@lucide/svelte/icons/calendar';
    import Clock from '@lucide/svelte/icons/clock';
    import type {ProjectListItem} from '$lib/types';

    interface Props {
        item: ProjectListItem;
        onClick?: () => void;
    }

    let {item, onClick}: Props = $props();
    const tags = $derived(item.tags ?? []);
</script>

<Card class="w-full overflow-hidden gap-4 cursor-pointer" onclick={onClick}>
    <div class="flex justify-between items-stretch w-full h-full">
        <div class="flex-1 min-w-0">
            <CardHeader class="grid grid-cols-[1fr] items-center gap-4">
                <div>
                    <CardTitle class="truncate h-5">{item.name}</CardTitle>
                    {#if item.company}
                        <CardDescription class="truncate h-5">{item.company}</CardDescription>
                    {/if}
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

            <CardFooter class="flex items-center justify-between text-sm text-muted-foreground pt-4">
                <div class="flex items-center gap-4">
                    {#if item.startDate}
                        <div class="flex items-center gap-1 max-w-lg">
                            <Calendar class="size-4 shrink-0"/>
                            <span class="line-clamp-1">Start: {item.startDate}</span>
                        </div>
                    {/if}
                    {#if item.duration}
                        <div class="flex items-center gap-1 max-w-lg">
                            <Clock class="size-4 shrink-0"/>
                            <span class="line-clamp-1">Duration: {item.duration}</span>
                        </div>
                    {/if}
                </div>
            </CardFooter>
        </div>

        <div class="flex flex-col items-center text-center text-sm shrink-0 mr-5">
            <div class="relative h-35 w-7 overflow-hidden rounded-full bg-muted/70 shadow-inner mb-2 mx-auto">
                <div
                        class="absolute left-1 right-1 bottom-1 rounded-full bg-gradient-to-t from-blue-500 to-blue-300 shadow-md"
                        style="height: calc({item.temperature}% - .5rem)"
                ></div>
            </div>
            <span class="text-xs font-semibold tabular-nums text-foreground">{item.temperature}°</span>
        </div>
    </div>
</Card>
