<template>
  <AdminUpdateDatasetPage />
</template>

<script setup lang="ts">
import type { Dataset } from '@datagouv/components-next'
import AdminUpdateDatasetPage from '~/components/Datasets/AdminUpdateDatasetPage.vue'

defineProps<{
  dataset: Dataset
}>()
</script>
