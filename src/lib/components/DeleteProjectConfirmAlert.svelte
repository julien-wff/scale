<script lang="ts">
    import { deleteProject } from '$lib/api';
    import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';

    interface Props {
        open: boolean;
        projectId?: string | null;
        ondelete?: () => void;
    }

    let { open = $bindable(false), projectId, ondelete }: Props = $props();

    let deleting = $state(false);

    async function handleDelete() {
        if (deleting || !projectId) return;

        deleting = true;

        try {
            await deleteProject(projectId);
            open = false;
            ondelete?.();
        } catch (error) {
            console.error('Failed to delete project:', error);
        } finally {
            deleting = false;
        }
    }
</script>

<AlertDialog.Root bind:open>
    <AlertDialog.Trigger>Open</AlertDialog.Trigger>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>This project will be permanently deleted. This action cannot be undone.</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel disabled={deleting}>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action class="bg-red-500 text-white hover:bg-red-600" onclick={handleDelete} disabled={deleting}>Delete</AlertDialog.Action>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
