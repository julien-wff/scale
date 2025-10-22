<script lang="ts">
    import * as Sidebar from '$lib/components/ui/sidebar';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Separator } from '$lib/components/ui/separator';
    import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '$lib/components/ui/select';
    import Filter from '@lucide/svelte/icons/filter';
    import Flame from '@lucide/svelte/icons/flame';

    // Controlled by parent via props
    let {
        q = '',
        onSearch = (v: string) => {},
        techs = [] as string[],
        onTechChange = (v: string) => {},
        minTemp = 0,
        maxTemp = 100,
        onTempChange = (a: { min: number; max: number }) => {},
    } = $props();
</script>

<Sidebar.Root>
    <Sidebar.Content>
        <Sidebar.Header>
            <div class="flex items-center gap-2">
                <Filter class="size-5" />
                <span class="font-semibold">Filters</span>
            </div>
        </Sidebar.Header>

        <div class="p-2">
            <Label class="text-xs">Search</Label>
            {#key q}
                <Input placeholder="Search projects..." bind:value={q} oninput={() => onSearch(q)} />
            {/key}
        </div>

        <Separator />

        <div class="p-2 space-y-2">
            <Label class="text-xs">Technology</Label>
            <Select type="single" onValueChange={(v: string) => onTechChange(v)}>
                <SelectTrigger class="w-full">
                    <span class="truncate text-left w-full">All technologies</span>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="">All</SelectItem>
                        {#each techs as t}
                            <SelectItem value={t}>{t}</SelectItem>
                        {/each}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>

        <Separator />

        <div class="p-2 space-y-1">
            <Label class="text-xs flex items-center gap-2"><Flame class="size-4" /> Priority</Label>
            <div class="flex items-center gap-2 text-xs">
                <input
                    type="number"
                    min="0"
                    max="100"
                    class="w-14 rounded-md border bg-background p-1"
                    bind:value={minTemp}
                    onchange={() => onTempChange({ min: Number(minTemp), max: Number(maxTemp) })}
                />
                <span>to</span>
                <input
                    type="number"
                    min="0"
                    max="100"
                    class="w-14 rounded-md border bg-background p-1"
                    bind:value={maxTemp}
                    onchange={() => onTempChange({ min: Number(minTemp), max: Number(maxTemp) })}
                />
                <span>%</span>
            </div>
        </div>

        <Sidebar.Separator />
        <Sidebar.Footer>
            <p class="text-[10px] text-muted-foreground">Tip: use the upload button to add a new project PDF.</p>
        </Sidebar.Footer>
    </Sidebar.Content>
    <Sidebar.Rail />
</Sidebar.Root>
