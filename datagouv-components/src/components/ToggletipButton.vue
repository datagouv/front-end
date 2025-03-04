<template>
  <BrandedButton
    color="secondary-softer"
    icon-only
    :icon="RiFileInfoLine"
    keep-margins-even-without-borders
  />
</template>

<script setup lang="ts">
import { RiFileInfoLine } from '@remixicon/vue'
import BrandedButton from './BrandedButton.vue'
</script>
