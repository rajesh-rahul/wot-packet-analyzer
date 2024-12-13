<script lang="ts">
    import DataView from './DataView.svelte';
    import FindTool from './FindTool.svelte';
    import PacketOverview from './PacketOverview.svelte';
</script>

<div class="h-full">
    <div class="flex h-full min-w-[310px] flex-col gap-2 px-6">
        <div class="rounded border border-gray-600">
            <div class="rounded-t bg-primary py-1 text-background">
                <span class="pl-5 text-lg font-extrabold">Data View</span>
            </div>
            <div class="py-2">
                <DataView />
            </div>
        </div>
        <div class="overflow-hidden rounded border border-gray-600">
            <div class="rounded-t bg-primary py-1 text-background">
                <span class="pl-5 text-lg font-extrabold">Find Tool</span>
            </div>
            <div class="py-2">
                <FindTool />
            </div>
        </div>
        <div class="rounded border border-gray-600">
            <div class="rounded-t bg-primary py-1 text-background">
                <span class="pl-5 text-lg font-extrabold">Packet View</span>
            </div>
            <PacketOverview />
        </div>
    </div>
</div>
