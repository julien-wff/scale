<script lang="ts">
    import * as Sidebar from '$lib/components/ui/sidebar';
    import { Input } from '$lib/components/ui/input';
    import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '$lib/components/ui/select';
    import Thermometer from '@lucide/svelte/icons/thermometer';

    interface Props {
        q: string;
        onSearch: (v: string) => void;
        techs: string[];
        onTechChange: (v: string) => void;
        selectedTech: string;
    }

    let { q = '', onSearch = (v: string) => {}, techs = [] as string[], onTechChange = (v: string) => {}, selectedTech = '' }: Props = $props();
</script>

<Sidebar.Root class="z-20">
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

    <Sidebar.Content class="gap-0">
        <Sidebar.Group class="pb-0">
            <Sidebar.GroupLabel>Search</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
                <Sidebar.Menu>
                    <Sidebar.MenuItem class="px-2">
                        <Input placeholder="Search projects..." bind:value={q} oninput={() => onSearch(q)} />
                    </Sidebar.MenuItem>
                </Sidebar.Menu>
            </Sidebar.GroupContent>
        </Sidebar.Group>

        <Sidebar.Group class="pb-0">
            <Sidebar.GroupLabel>Technology</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
                <Sidebar.Menu>
                    <Sidebar.MenuItem class="px-2">
                        <Select type="single" onValueChange={(v: string) => onTechChange(v)}>
                            <SelectTrigger class="w-full">
                                <span class="truncate text-left w-full">{selectedTech || 'All technologies'}</span>
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
                    </Sidebar.MenuItem>
                </Sidebar.Menu>
            </Sidebar.GroupContent>
        </Sidebar.Group>
    </Sidebar.Content>

    <Sidebar.Rail />
</Sidebar.Root>
