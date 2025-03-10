<template>
  <ReuseCard
    :certifier="config.public.title"
    :reuse
    :style
    :show-description
    :reuse-url="reuse.page"
    :organization-url="localePath(`/organizations/${reuse.organization?.slug}`)"
  />
</template>

<script setup lang="ts">
import { ReuseCard, type Reuse } from '@datagouv/components-next'
import type { StyleValue } from 'vue'

withDefaults(defineProps<{
  reuse: Reuse
  style?: StyleValue
  showDescription?: boolean
}>(), {
  showDescription: true,
})

const localePath = useLocalePath()
const config = useRuntimeConfig()
</script>
