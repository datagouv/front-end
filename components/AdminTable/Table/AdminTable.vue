<template>
  <div class="fr-table fr-mb-2w">
    <table class="lg:!table">
      <slot />
    </table>
    <div
      v-if="loading"
      class="container fr-p-4w text-align-center"
    >
      <AdminLoader />
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminLoader from '../../AdminLoader/AdminLoader.vue'

withDefaults(defineProps<{
  loading?: boolean
}>(), {
  loading: false,
})
</script>

<style scoped>
.fr-table {
  --lh: 1.125rem;
  --max-lines: 2;
}

.fr-table table :deep(th) {
  border: 1px solid #cecece;
  border-bottom: 0;
}

.fr-table table :deep(tbody tr:nth-child(even)) {
  background-color: var(--background-alt-grey);
  --hover: var(--background-alt-grey-hover);
  --active: var(--background-alt-grey-active);
}

.fr-table table :deep(td) {
  padding: 0.5rem 0.34375rem !important;
  border: 1px solid #cecece;
  border-top: 0;
  height: calc(var(--lh) * var(--max-lines) + 1rem);
}

.fr-table table :deep(*) {
  font-size: 0.75rem;
  line-height: var(--lh);
}

.fr-table :deep(tbody), .fr-table :deep(thead) {
  background-color: var(--background-default-grey);
  --hover: var(--background-default-gray-hover);
  --active: var(--background-default-gray-active);
}
</style>
