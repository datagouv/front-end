<template>
  <div
    class="relative"
    @focusin="show = true"
    @mouseenter="show = true"
    @focusout="show = false"
    @mouseleave="show = false"
  >
    <ClientOnly>
      <p
        ref="reference"
        v-bind="$attrs"
        :aria-describedby="id"
        class="!mb-0"
      >
        <slot />
      </p>

      <div
        v-show="show"
        :id
        ref="floating"
        role="tooltip"
        aria-hidden="true"
        class="z-10 pt-2"
        :class="tooltipClass"
        :style="floatingStyles"
      >
        <div class="drop-shadow bg-white p-2 whitespace-nowrap">
          <slot name="tooltip" />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useFloating, autoUpdate, autoPlacement } from '@floating-ui/vue'

defineProps<{
  tooltipClass?: string
}>()

const id = useId()
const show = ref(false)

const referenceRef = useTemplateRef('reference')
const floatingRef = useTemplateRef('floating')
const { floatingStyles } = useFloating(referenceRef, floatingRef, {
  middleware: [autoPlacement({
    allowedPlacements: ['bottom-start', 'bottom', 'bottom-end'],
  })],
  whileElementsMounted: autoUpdate,
})
</script>
