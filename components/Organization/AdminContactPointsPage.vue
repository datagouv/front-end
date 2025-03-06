<template>
  <LoadingBlock :status>
    <div v-if="pageData && pageData.total > 0">
      <AdminContactPointsTable
        :contact-points="pageData ? pageData.data : []"
        :organization
        :sort-direction="direction"
        :sorted-by
        @refresh="refresh"
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
import { Pagination, type Organization } from '@datagouv/components-next'
import AdminContactPointsTable from '~/components/AdminTable/AdminContactPointsTable/AdminContactPointsTable.vue'
import type { ContactPoint, PaginatedArray, SortDirection } from '~/types/types'

const props = defineProps<{
  organization: Organization
}>()

const page = ref(1)
const pageSize = ref(20)
const sortedBy = ref('created')
const direction = ref<SortDirection>('desc')

const params = computed(() => {
  return {
    page_size: pageSize.value,
    page: page.value,
  }
})

const { data: pageData, status, refresh } = await useAPI<PaginatedArray<ContactPoint>>(`/api/1/organizations/${props.organization.id}/contacts/`, { lazy: true, params })
</script>
