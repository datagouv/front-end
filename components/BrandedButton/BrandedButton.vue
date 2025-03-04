<template>
  <component
    :is="href ? NuxtLinkLocale: 'button'"
    class="inline-flex items-center space-x-1 rounded-full font-medium border !bg-none !no-underline"
    :class="[colors, sizes, removePaddingsIfNoBorders, isDisabled ? '!opacity-50' : '']"
    :disabled="isDisabled"
    :aria-disabled="isDisabled"
    :role="href ? 'link' : ''"
    :to="isDisabled ? undefined : href"
    :target="newTab ? '_blank' : undefined"
  >
    <AdminLoader
      v-if="loading"
      size="16"
      :color="color === 'primary' ? 'white' : 'primary'"
    />
    <component
      :is="icon"
      v-else-if="icon"
      :class="iconSize"
    />
    <span
      v-if="hasText"
      class="whitespace-nowrap"
      :class="iconOnly ? 'sr-only' : ''"
    ><slot /></span>
  </component>
</template>

<script setup lang="ts">
import type {
  Component,
  Slot,
  VNode,
} from 'vue'
import {
  Comment,
  Text,
} from 'vue'
import { bannerActionTypeKey } from '~/components/BannerAction.vue'

import { NuxtLinkLocale } from '#components'

type ColorType = 'primary' | 'primary-soft' | 'primary-softer' | 'secondary' | 'secondary-softer' | 'warning' | 'danger' | 'tertiary'

const props = withDefaults(defineProps<{
  size?: 'xs' | 'sm' | 'lg'
  color?: ColorType
  disabled?: boolean
  loading?: boolean
  icon?: Component
  href?: string
  newTab?: boolean
  iconOnly?: boolean
  keepMarginsEvenWithoutBorders?: boolean
}>(), {
  newTab: false,
  iconOnly: false,
  keepMarginsEvenWithoutBorders: false,
})

const slots = useSlots()

const size = computed(() => {
  if (props.size) return props.size
  if (bannerActionType) return 'xs'
  return 'sm'
})

const color = computed<ColorType>(() => {
  if (props.color) return props.color
  if (bannerActionType) {
    return {
      primary: 'primary-soft' as ColorType,
      warning: 'warning' as ColorType,
      danger: 'danger' as ColorType,
    }[bannerActionType]
  }
  return 'primary'
})

const hasText = computed(() => {
  return hasSlotContent(slots.default) && !props.iconOnly
})
const bannerActionType = inject(bannerActionTypeKey, null)

const isDisabled = computed(() => props.disabled || props.loading)

const colors = computed(() => {
  return {
    'primary': `text-white bg-datagouv-dark !border-datagouv-dark ${!isDisabled.value ? 'hover:!bg-datagouv-hover hover:!border-datagouv-hover' : ''}`,
    'primary-soft': `text-datagouv-dark bg-transparent !border-datagouv-dark ${!isDisabled.value ? '[&&]:hover:!bg-gray-some' : ''}`,
    'primary-softer': `text-datagouv-dark bg-transparent !border-transparent ${!isDisabled.value ? '[&&]:hover:!bg-gray-some' : ''}`,
    'secondary': `text-gray-plain bg-white !border-gray-plain ${!isDisabled.value ? '[&&]:hover:!bg-gray-some' : ''}`,
    'secondary-softer': `text-gray-plain !border-transparent ${!isDisabled.value ? '[&&]:hover:!bg-gray-some' : ''}`,
    'warning': `text-warning-dark bg-white !border-warning-dark ${!isDisabled.value ? '[&&]:hover:!bg-gray-some' : ''}`,
    'danger': `!text-danger-dark bg-white !border-danger-dark ${!isDisabled.value ? '[&&]:hover:!bg-gray-some' : ''}`,
    'tertiary': `!border-none bg-transparent text-datagouv-dark ${!isDisabled.value ? '[&&]:hover:!bg-gray-some' : ''}`,
  }[color.value]
})

const sizes = computed(() => {
  return {
    lg: `text-lg ${hasText.value ? 'px-6 py-2' : 'p-3'}`,
    sm: `text-sm leading-none ${hasText.value ? 'px-4 py-3' : 'p-2.5'}`,
    xs: `text-xs leading-[0.875rem] ${hasText.value ? 'px-4 py-2' : 'p-2'}`,
  }[size.value]
})

const hasBorders = computed(() => {
  return props.color !== 'primary-softer' && props.color !== 'secondary-softer'
})

const removePaddingsIfNoBorders = computed(() => {
  if (hasBorders.value) return ''
  if (props.keepMarginsEvenWithoutBorders) return ''

  return {
    lg: hasText.value ? '-mx-6 -my-2' : '-m-3',
    sm: hasText.value ? '-mx-4 -my-3' : '-m-2.5',
    xs: hasText.value ? '-mx-4 -my-2' : '-m-2',
  }[size.value]
})

const iconSize = computed(() => {
  return {
    lg: hasBorders.value ? 'size-6' : 'size-8',
    sm: hasBorders.value ? 'size-4' : 'size-6',
    xs: hasBorders.value ? 'size-3' : 'size-5',
  }[size.value]
})

function hasSlotContent(slot: Slot | undefined, slotProps = {}): boolean {
  if (!slot) return false

  return slot(slotProps).some((vnode: VNode) => {
    if (vnode.type === Comment) return false

    if (Array.isArray(vnode.children) && !vnode.children.length) return false

    return (
      vnode.type !== Text
      || (typeof vnode.children === 'string' && vnode.children.trim() !== '')
    )
  })
}
</script>
