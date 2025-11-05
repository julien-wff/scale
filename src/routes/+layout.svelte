<script lang="ts">
    import '../app.css';
    import faviconIco from '$lib/assets/favicon.ico';
    import faviconPng from '$lib/assets/favicon.png';
    import { notificationState } from '$lib/stores/notification.svelte';

    let {children} = $props();
</script>

<svelte:head>
    {#if notificationState.processingProjects > 0}
        <link rel="icon" type="image/gif" href="/loader.gif" sizes="32x32"/>
    {:else}
        <link rel="icon" type="image/x-icon" href={faviconIco} sizes="32x32"/>
        <link rel="icon" type="image/png" href={faviconPng} sizes="128x128"/>
    {/if}
    <title>Scale - Agentic opportunities management</title>
</svelte:head>

{@render children?.()}
