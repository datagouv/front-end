<template>
  <DiscussionsPage :subject="dataset" />
</template>

<script setup lang="ts">
import type { Dataset } from '@datagouv/components-next'
import DiscussionsPage from '~/components/Discussions/DiscussionsPage.vue'

defineProps<{
  dataset: Dataset
}>()
</script>
