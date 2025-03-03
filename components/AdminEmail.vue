<template>
    <p class="px-1 rounded-2 monospace text-sm text-gray-medium bg-gray-lower m-0">{{ email }}</p>
</template>
<script setup lang="ts">
defineProps<{
    email: string;
}>();
</script>
