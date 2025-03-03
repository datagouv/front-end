<template>
  <LoadingBlock :status>
    <div v-if="pageData && pageData.total > 0">
      <AdminContactPointsTable
        :contact-points="pageData ? pageData.data : []"
        :sort-direction="direction"
        :sorted-by
      />
      <Pagination
        :page="page"
        :page-size="pageSize"
        :total-results="pageData.total"
        @change="(changedPage: number) => page = changedPage"
      />
    </div>
  </LoadingBlock>
</template>

<script setup lang="ts">
import type { Organization } from '@datagouv/components'
import type { ContactPoint, PaginatedArray, SortDirection } from '~/types/types'

const props = defineProps<{
  organization: Organization
}>()

const { t } = useI18n()
const { $api } = useNuxtApp()

const page = ref(1)
const pageSize = ref(20)
const sortedBy = ref('created')
const direction = ref<SortDirection>('desc')
const sortDirection = computed(() => `${direction.value === 'asc' ? '' : '-'}${sortedBy.value}`)

const params = computed(() => {
  return {
    organization: props.organization.id,

    sort: sortDirection.value,
    page_size: pageSize.value,
    page: page.value,
  }
})

const { data: pageData, status } = await useAPI<PaginatedArray<ContactPoint>>('/api/1/datasets/', { lazy: true, params })

async function updateContactPoint(contactPoint: ContactPoint) {
  await newContactPoint($api, datasetForm.value.owned?.organization, datasetForm.value.contact_points[contactPointKey])
}
</script>
