<script lang="ts">
    import '../app.css';
    import faviconIco from '$lib/assets/favicon.ico';
    import faviconPng from '$lib/assets/favicon.png';

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" type="image/x-icon" href={faviconIco} sizes="32x32" />
    <link rel="icon" type="image/png" href={faviconPng} sizes="128x128" />
    <title>Scale - Agentic opportunities management</title>
</svelte:head>

{@render children?.()}
