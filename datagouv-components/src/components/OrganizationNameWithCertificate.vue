<template>
  <div class="flex gap-1 items-center">
    <OwnerTypeIcon
      v-if="showType"
      :type="getOrganizationType(organization)"
    />
    <div
      class="mb-0 truncate"
      :class="{ 'text-sm': size === 'sm' }"
    >
      {{ organization.name }}
    </div>
    <RiCheckboxCircleLine
      v-if="isOrganizationCertified(organization)"
      class="flex-none"
      :class="{
        'size-4': size === 'sm',
        'start-5': size === 'base',
      }"
      :title="t('The identity of this public service is certified by {certifier}', { certifier: config.name })"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { RiCheckboxCircleLine } from '@remixicon/vue'
import { useI18n } from 'vue-i18n'
import { getOrganizationType, isOrganizationCertified } from '../functions/organizations'
import type { Organization } from '../types/organizations'
import { useComponentsConfig } from '../main'
import OwnerTypeIcon from './OwnerTypeIcon.vue'

const config = useComponentsConfig()

const { t } = useI18n()
withDefaults(defineProps<{
  organization: Organization
  showType?: boolean
  size?: 'base' | 'sm'
}>(), {
  showType: true,
  size: 'base',
})
</script>
