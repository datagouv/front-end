<template>
  <AdminDatasetResourcesPage />
</template>

<script setup lang="ts">
import type { Dataset } from '@datagouv/components-next'
import AdminDatasetResourcesPage from '~/components/Datasets/AdminDatasetResourcesPage.vue'

defineProps<{
  dataset: Dataset
}>()
</script>
