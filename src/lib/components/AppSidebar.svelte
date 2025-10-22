<script lang="ts">
    import * as Sidebar from '$lib/components/ui/sidebar';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '$lib/components/ui/select';
    import Thermometer from '@lucide/svelte/icons/thermometer';

    interface Props {
        q: string;
        onSearch: (v: string) => void;
        techs: string[];
        onTechChange: (v: string) => void;
    }

    let { q = '', onSearch = (v: string) => {}, techs = [] as string[], onTechChange = (v: string) => {} } = $props();
</script>

<Sidebar.Root>
    <Sidebar.Content>
        <Sidebar.Header>
            <Sidebar.Menu>
                <Sidebar.MenuItem>
                    <Sidebar.MenuButton size="lg">
                        {#snippet child({ props })}
                            <a href="/" {...props}>
                                <div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Thermometer class="size-4" />
                                </div>
                                <div class="flex flex-col gap-0.5 leading-none">
                                    <span class="font-semibold">Scale</span>
                                </div>
                            </a>
                        {/snippet}
                    </Sidebar.MenuButton>
                </Sidebar.MenuItem>
            </Sidebar.Menu>
        </Sidebar.Header>

        <div class="p-2">
            <Label class="text-xs mb-2">Search</Label>
            <Input placeholder="Search projects..." bind:value={q} oninput={() => onSearch(q)} />
        </div>

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

        <Sidebar.Separator />

        <Sidebar.Footer>
            <p class="text-[10px] text-muted-foreground">Tip: use the upload button to add a new project PDF.</p>
        </Sidebar.Footer>
    </Sidebar.Content>
    <Sidebar.Rail />
</Sidebar.Root>
