<template>
  <BrandedButton
    v-if="!config.public.readOnlyMode"
    :href="link"
    color="primary"
    :external="type === 'harvester'"
  >
    <span v-if="type === 'harvester'">{{ t("Create an harvester on") }}</span>
    <span v-else>{{ t("Publish on") }}</span>&nbsp;<SiteLogo />
  </BrandedButton>
</template>

<script setup lang="ts">
import { BrandedButton } from '@datagouv/components-next'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const props = defineProps<{
  type: 'dataset' | 'harvester' | 'reuse' | 'dataservice'
}>()

const { t } = useI18n()

const config = useRuntimeConfig()

const link = computed(() => {
  switch (props.type) {
    case 'dataset':
      return '/beta/admin/datasets/new'
    case 'harvester':
      return `/beta/admin/harvesters/new/`
    case 'reuse':
      return '/beta/admin/reuses/new'
    case 'dataservice':
      return '/beta/admin/dataservices/new'
    default:
      throwOnNever(props.type, '')
      return ''
  }
})
</script>
