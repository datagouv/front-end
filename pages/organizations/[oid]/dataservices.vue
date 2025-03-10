<template>
  <div>
    <h2 class="!text-sm !mb-2.5">
      {{ $t('Organization dataservices') }}
    </h2>
    <DataservicesSearchPage :organization />
  </div>
</template>

<script setup lang="ts">
import type { Organization } from '@datagouv/components-next'

defineProps<{
  organization: Organization
}>()
</script>
