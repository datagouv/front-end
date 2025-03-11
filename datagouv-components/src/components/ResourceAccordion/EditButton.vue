<template>
  <BrandedButton
    :href="adminUrl"
    icon-only
    :icon="RiPencilLine"
    color="warning"
    data-testid="edit-button"
  >
    {{ t("Edit file") }}
  </BrandedButton>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RiPencilLine } from '@remixicon/vue'
import { useComponentsConfig } from '../../config'
import BrandedButton from '../BrandedButton.vue'

type Props = {
  datasetId: string
  isCommunityResource?: boolean
  resourceId: string
}

const props = withDefaults(defineProps<Props>(), {
  isCommunityResource: false,
})

const config = useComponentsConfig()

const { t } = useI18n()
const resourceType = props.isCommunityResource ? 'community-resource' : 'resource'
const adminUrl = `${config.baseUrl}/dataset/${props.datasetId}/${resourceType}/${props.resourceId}`
</script>
