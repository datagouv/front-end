<template>
  <li
    v-if="!qualityItem"
    class="text-warning-dark flex flex-wrap items-center m-1"
  >
    <p class="fr-my-0 fr-text--sm">
      <span
        class="fr-icon-warning-line fr-icon--sm"
        aria-hidden="true"
      />
      {{ message }}
    </p>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  qualityItem: boolean
  message: string
}>()
</script>
