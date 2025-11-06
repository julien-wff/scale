<script lang="ts">
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
    import * as Sidebar from '$lib/components/ui/sidebar/index.js';
    import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
    import CircleUserRound from '@lucide/svelte/icons/circle-user-round';

    interface Props {
        managers: { id: number; name: string; specialities: string }[];
        selectedManagerId: number | null;
    }

    let { managers, selectedManagerId = $bindable(null) }: Props = $props();

    let activeManager = $derived(managers.find(m => m.id === selectedManagerId) ?? managers[0]);
</script>

<Sidebar.Menu>
    <Sidebar.MenuItem>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                {#snippet child({ props })}
                    <Sidebar.MenuButton {...props} size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                        <div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                            <CircleUserRound class="size-4" />
                        </div>
                        <div class="grid flex-1 text-left text-sm leading-tight">
                            <span class="truncate font-medium">
                                {activeManager.name}
                            </span>
                            <span class="truncate text-xs">{activeManager.specialities}</span>
                        </div>
                        <ChevronsUpDownIcon class="ml-auto" />
                    </Sidebar.MenuButton>
                {/snippet}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg" align="start" side={'right'} sideOffset={4}>
                <DropdownMenu.Label class="text-muted-foreground text-xs">Managers</DropdownMenu.Label>
                {#each managers as manager (manager.id)}
                    <DropdownMenu.Item onSelect={() => (activeManager = manager)} class="gap-2 p-2">
                        <div
                            class="flex size-6 items-center justify-center rounded-md"
                            class:bg-sidebar-primary={manager.id === activeManager.id}
                            class:text-sidebar-primary-foreground={manager.id === activeManager.id}
                            class:border={manager.id !== activeManager.id}
                        >
                            <CircleUserRound class="size-3.5 shrink-0 text-inherit" />
                        </div>
                        <div class="grid flex-1 text-left">
                            <span class="truncate font-medium">{manager.name}</span>
                            <span class="truncate text-xs text-muted-foreground">{manager.specialities}</span>
                        </div>
                    </DropdownMenu.Item>
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </Sidebar.MenuItem>
</Sidebar.Menu>
