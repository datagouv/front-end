<template>
  <a
    class="inline-flex items-baseline !bg-none underline space-x-1 link"
    :href="subject.page"
  >
    <component
      :is="icon"
      class="self-center size-3.5"
    />
    <TextClamp
      :text="subject.title"
      :auto-resize="true"
      :max-lines="1"
    />
  </a>
</template>

<script setup lang="ts">
import { RiDatabase2Line, RiLineChartLine } from '@remixicon/vue'

const props = defineProps<{
  type: 'Dataset' | 'Reuse'
  subject: { title: string, page: string }
}>()

const icon = computed(() => {
  if (props.type === 'Dataset') return RiDatabase2Line
  if (props.type === 'Reuse') return RiLineChartLine

  return throwOnNever(props.type, `Unknown subject ${JSON.stringify(props.subject)}`)
})
</script>
