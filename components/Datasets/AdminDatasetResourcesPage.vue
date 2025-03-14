<template>
  <div class="bg-white fr-p-3w">
    <div class="flex flex-wrap justify-between items-center">
      <h2
        v-if="resourcesPage"
        class="text-sm font-bold uppercase m-0"
      >
        {{ t('{n} files', resourcesPage.total) }}
      </h2>
      <UploadResourceModal
        :extensions
        @new-files="addFiles"
      />
    </div>

    <!-- :key is here to force re-render when length change and then re-call onMounted -->
    <FileEditModal
      v-if="resourceForms.length"
      :key="resourceForms.length"
      :resource="resourceForms[0]"
      open-on-mounted
      :loading
      @submit="saveFirstNewFile"
      @cancel="removeFirstNewFile"
    />

    <LoadingBlock :status>
      <AdminTable v-if="resourcesPage && resourcesPage.data.length">
        <thead>
          <tr>
            <AdminTableTh
              scope="col"
            >
              {{ t('File name') }}
            </AdminTableTh>
            <AdminTableTh scope="col">
              {{ t("Status") }}
            </AdminTableTh>
            <AdminTableTh scope="col">
              {{ t("Type") }}
            </AdminTableTh>
            <AdminTableTh scope="col">
              {{ t("Format") }}
            </AdminTableTh>
            <AdminTableTh
              scope="col"
            >
              {{ t('Created at') }}
            </AdminTableTh>
            <AdminTableTh
              scope="col"
            >
              {{ t('Updated at') }}
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
            v-for="resource, index in resourcesPage.data"
            :key="resource.id"
          >
            <td>
              <TextClamp
                :text="resource.title"
                :auto-resize="true"
                :max-lines="2"
              />
            </td>
            <td>
              <AdminBadge
                size="xs"
                :type="getStatus(resource).type"
              >
                {{ getStatus(resource).label }}
              </AdminBadge>
            </td>
            <td>
              {{ resource.type }}
            </td>
            <td>
              {{ resource.format }}
            </td>
            <td>
              {{ formatDate(resource.created_at) }}
            </td>
            <td>
              {{ formatDate(resource.last_modified) }}
            </td>
            <td>
              <FileEditModal
                :dataset
                :loading
                :resource="resourceToForm(resource, schemas || [])"
                @submit="updateResource"
                @delete="refreshResources"
              />
            </td>
          </tr>
        </tbody>
      </AdminTable>
      <Pagination
        v-if="resourcesPage && resourcesPage.total > pageSize"
        :page="page"
        :page-size="pageSize"
        :total-results="resourcesPage.total"
        @change="(changedPage: number) => page = changedPage"
      />
    </LoadingBlock>
  </div>
</template>

<script setup lang="ts">
import { Pagination, type DatasetV2, type Resource, type SchemaResponseData } from '@datagouv/components-next'
import { useI18n } from 'vue-i18n'
import AdminTable from '../AdminTable/Table/AdminTable.vue'
import AdminTableTh from '../AdminTable/Table/AdminTableTh.vue'
import UploadResourceModal from './UploadResourceModal.vue'
import FileEditModal from './FileEditModal.vue'
import type { AdminBadgeType, PaginatedArray, ResourceForm } from '~/types/types'

const route = useRoute()
const { toast } = useToast()
const { $api } = useNuxtApp()

const { data: schemas } = await useAPI<SchemaResponseData>('/api/1/datasets/schemas/')
const { data: extensions } = await useAPI<Array<string>>('/api/1/datasets/extensions/')

const datasetUrl = computed(() => `/api/2/datasets/${route.params.id}`)
const { data: dataset, status } = await useAPI<DatasetV2>(datasetUrl)
const resourcesPage = ref<PaginatedArray<Resource> | null>(null)
const page = ref(1)
const pageSize = ref(20)

const resourcesUrl = computed(() => {
  if (!dataset.value) return

  const url = new URL(dataset.value.resources.href)
  url.searchParams.set('page_size', pageSize.value.toString())
  url.searchParams.set('page', page.value.toString())
  return url.toString()
})

const refreshResources = async () => {
  if (!resourcesUrl.value) return
  resourcesPage.value = await $api<PaginatedArray<Resource>>(resourcesUrl.value)
}
watchEffect(async () => await refreshResources())

const { t } = useI18n()

const resourceForms = ref<Array<ResourceForm>>([])
const loading = ref(false)

const addFiles = (files: Array<ResourceForm>) => {
  resourceForms.value = files
}
const removeFirstNewFile = () => {
  resourceForms.value = [...resourceForms.value.slice(1)]
}
const saveFirstNewFile = async (closeModal: () => void, form: ResourceForm) => {
  loading.value = true
  try {
    await saveResourceForm(dataset.value, form)
    closeModal()
  }
  finally {
    loading.value = false
  }
  removeFirstNewFile()

  page.value = 1
  refreshResources()
}
const updateResource = async (closeModal: () => void, resourceForm: ResourceForm) => {
  loading.value = true

  try {
    await saveResourceForm(dataset.value, resourceForm)
    await refreshResources()
    closeModal()
  }
  finally {
    loading.value = false
  }

  toast.success(t('Resource updated!'))
}

function getStatus(resource: Resource): { label: string, type: AdminBadgeType } {
  if (resource.extras['check:available'] === true) {
    return {
      label: t('Available'),
      type: 'primary',
    }
  }

  if (resource.extras['check:available'] === false) {
    return {
      label: t('Unavailable'),
      type: 'danger',
    }
  }

  return {
    label: t('Unknown'),
    type: 'warning',
  }
}
</script>
