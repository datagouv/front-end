<template>
  <div class="bg-white fr-p-3w">
    <div class="flex flex-wrap justify-between items-center">
      <h2
        v-if="pageData"
        class="text-sm font-bold uppercase m-0"
      >
        {{ t('{n} discussions', pageData.total) }}
      </h2>
    </div>

    <LoadingBlock :status>
      <AdminTable v-if="pageData && pageData.data.length">
        <thead>
          <tr>
            <AdminTableTh
              scope="col"
            >
              {{ t('Discussion') }}
            </AdminTableTh>
            <AdminTableTh scope="col">
              {{ t("Status") }}
            </AdminTableTh>
            <AdminTableTh
              scope="col"
            >
              {{ t('Created at') }}
            </AdminTableTh>
            <AdminTableTh
              scope="col"
            >
              {{ t('Closed at') }}
            </AdminTableTh>
            <AdminTableTh
              scope="col"
            >
              {{ t("Action") }}
            </AdminTableTh>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="thread in pageData.data"
            :key="thread.id"
          >
            <td>
              <TextClamp
                :text="thread.title"
                :auto-resize="true"
                :max-lines="2"
              />
            </td>
            <td>
              <AdminBadge
                size="xs"
                :type="getStatus(thread).type"
              >
                {{ getStatus(thread).label }}
              </AdminBadge>
            </td>
            <td>
              {{ formatDate(thread.created) }}
            </td>
            <td>
              {{ formatDate(thread.closed) }}
            </td>
            <td>
              <BrandedButton
                size="xs"
                color="secondary-softer"
                :icon="RiEyeLine"
                :href="getDiscussionUrl(thread.id, subject)"
                external
                keep-margins-even-without-borders
              />
            </td>
          </tr>
        </tbody>
      </AdminTable>
      <Pagination
        v-if="pageData && pageData.total > pageSize"
        :page="page"
        :page-size="pageSize"
        :total-results="pageData.total"
        @change="(changedPage: number) => page = changedPage"
      />
    </LoadingBlock>
  </div>
</template>

<script setup lang="ts">
import { BrandedButton, Pagination } from '@datagouv/components-next'
import { useI18n } from 'vue-i18n'
import { RiEyeLine } from '@remixicon/vue'
import AdminTable from '../AdminTable/Table/AdminTable.vue'
import AdminTableTh from '../AdminTable/Table/AdminTableTh.vue'
import type { AdminBadgeType, PaginatedArray } from '~/types/types'
import type { DiscussionSubjectTypes, Thread } from '~/types/discussions'

const props = defineProps<{
  subject: DiscussionSubjectTypes
}>()

const { t } = useI18n()

const page = ref(1)
const pageSize = ref(20)

const params = computed(() => {
  return {
    for: props.subject.id,

    page_size: pageSize.value,
    page: page.value,
  }
})
const { data: pageData, status } = await useAPI<PaginatedArray<Thread>>('/api/1/discussions/', { lazy: true, query: params })

function getStatus(thread: Thread): { label: string, type: AdminBadgeType } {
  if (thread.closed) {
    return {
      label: t('Closed'),
      type: 'secondary',
    }
  }

  if (thread.discussion.length === 1) {
    return {
      label: t('New'),
      type: 'primary',
    }
  }

  return {
    label: t('Responded'),
    type: 'secondary',
  }
}
</script>
