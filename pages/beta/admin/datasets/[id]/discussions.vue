<template>
  <DiscussionsPage :id="dataset.id" />
</template>

<script setup lang="ts">
import type { Dataset } from '@datagouv/components-next'
import DiscussionsPage from '~/components/Discussions/DiscussionsPage.vue'

defineProps<{
  dataset: Dataset
}>()
</script>
