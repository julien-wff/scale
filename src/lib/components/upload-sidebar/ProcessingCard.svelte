<script lang="ts">
    import type { ApiProject } from '$lib/types';
    import { onMount } from 'svelte';
    import * as Card from '../ui/card';
    import dayjs from 'dayjs';
    import relativeTime from 'dayjs/plugin/relativeTime';

    dayjs.extend(relativeTime);

    interface Props {
        project: ApiProject;
    }

    let { project }: Props = $props();

    let durationFromNow = $state('');
    updateDuration();

    function updateDuration() {
        durationFromNow = dayjs(project.createdAt).fromNow();
    }

    onMount(() => {
        const interval = setInterval(updateDuration, 10000); // Update every 10 seconds
        return () => clearInterval(interval);
    });
</script>

<Card.Root class="px-3 py-2 gap-1">
    <span class="text-sm">{project.original_file_name + '.pdf'}</span>
    <span class="text-xs">Started {durationFromNow}</span>
</Card.Root>
