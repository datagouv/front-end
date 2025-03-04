<template>
  <div class="bg-white">
    <button
      type="button"
      class="fr-btn fr-btn--tertiary-no-outline shrink-0"
      title="Some title"
    >
      <RiDraggable class="size-8" />
    </button>
    <button
      type="button"
      class="fr-btn fr-btn--tertiary-no-outline shrink-0"
      title="Some title"
    >
      <RiDeleteBinLine class="size-8" />
    </button>
    <button
      class="fr-btn fr-btn--sm fr-btn--secondary-grey-500 fr-btn--tertiary-no-outline fr-icon-pencil-line"
    >
      {{ $t("Edit") }}
    </button>

    <button
      class="fr-btn fr-btn--secondary fr-btn--secondary-grey-500"
      type="button"
    >
      {{ $t("Cancel") }}
    </button>
    <button
      class="fr-btn fr-btn--sm fr-btn--secondary-grey-500 fr-btn--tertiary-no-outline fr-icon-pencil-line"
    >
      {{ $t("Edit file") }}
    </button>
    <button
      class="shrink-0 fr-ml-1w fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-icon-arrow-down-line"
      :title="$t('Sort')"
    >
      {{ $t("Sort") }}
    </button>
    <a
      href="#"
      class="fr-btn fr-btn--tertiary-no-outline fr-btn--secondary-grey-500 fr-btn--icon-left fr-icon-lightbulb-line"
    >
      {{ $t('Give us your feedback on the publishing form') }}
    </a>
    <button
      class="fr-btn--close fr-btn"
      :title="$t('Close the modal window')"
      type="button"
    >
      {{ $t('Close') }}
    </button>
  </div>
  <div class="flex space-x-5">
    <div
      v-for="({ disabled, loading, as }, index) in [
        { disabled: false, loading: false, as: 'button' },
        { disabled: true, loading: false, as: 'button' },
        { disabled: false, loading: true, as: 'button' },
        { disabled: false, loading: false, as: 'a' },
        { disabled: true, loading: false, as: 'a' },
        { disabled: false, loading: true, as: 'a' },
      ]"
      :key="index"
      class="space-y-5"
    >
      <div
        v-for="color in ['primary', 'primary-soft', 'primary-softer', 'secondary', 'secondary-softer', 'warning', 'danger']"
        :key="color"
        class="space-y-5"
      >
        <div>{{ as }} {{ color }} <span v-if="disabled">disabled</span> <span v-if="loading">loading</span></div>
        <div
          v-for="({ icon, text }, index) in [
            { icon: null, text: 'Explorer les données' },
            { icon: RiLightbulbFlashLine, text: 'Explorer les données' },
            { icon: RiLightbulbFlashLine, text: null },
          ]"
          :key="index"
          class="space-y-2 flex flex-col items-start"
        >
          <div
            v-for="size in ['lg', 'sm', 'xs']"
            :key="size"
          >
            <BrandedButton
              :color
              :size
              :icon
              :loading
              :disabled
              :as
              :href="as === 'a' ? 'https://data.gouv.fr' : undefined"
            >
              {{ text }}
            </BrandedButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RiDeleteBinLine, RiDraggable, RiLightbulbFlashLine } from '@remixicon/vue'
</script>
