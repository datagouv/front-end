<template>
  <AdminTable>
    <thead>
      <AdminTableTh scope="col">
        {{ t("Resource title") }}
      </AdminTableTh>
      <AdminTableTh class="w-44">
        {{ t("Status") }}
      </AdminTableTh>
      <AdminTableTh class="w-14">
        {{ t("Format") }}
      </AdminTableTh>
      <AdminTableTh
        class="w-32"
        scope="col"
      >
        {{ t("Created at") }}
      </AdminTableTh>
      <AdminTableTh
        class="w-32"
        scope="col"
      >
        {{ t("Modified at") }}
      </AdminTableTh>
      <AdminTableTh
        class="w-32"
        scope="col"
      >
        {{ t("Action") }}
      </AdminTableTh>
    </thead>
    <tbody>
      <tr
        v-for="communityResource in communityResources"
        :key="communityResource.id"
      >
        <td>
          <AdminContentWithTooltip class="fr-text--bold">
            <a
              class="fr-link fr-reset-link"
              :href="getCommunityResourceLinkToAdmin(communityResource)"
            >
              <TextClamp
                :text="communityResource.title"
                :auto-resize="true"
                :max-lines="2"
              />
            </a>
          </AdminContentWithTooltip>
          <p v-if="communityResource.dataset">
            <LinkToSubject
              type="Dataset"
              :subject="communityResource.dataset"
            />
          </p>
        </td>
        <td>
          <AdminBadge
            size="xs"
            :type="getStatus(communityResource).type"
          >
            {{ getStatus(communityResource).label }}
          </AdminBadge>
        </td>
        <td>
          <code class="fr-p-1v font-mono bg-grey-100 fr-text--sm text-mention-grey rounded">{{ communityResource.format }}</code>
        </td>
        <td>{{ formatDate(communityResource.created_at) }}</td>
        <td>{{ formatDate(communityResource.last_modified) }}</td>
        <td>
          <FileEditModal
            :dataset="communityResource.dataset"
            :loading
            :resource="resourceToForm(communityResource, schemas || [])"
            button-classes="fr-btn fr-btn--sm fr-btn--secondary-grey-500 fr-btn--tertiary-no-outline fr-icon-pencil-line"
            @submit="(closeModal, resourceForm) => updateResource(communityResource, closeModal, resourceForm)"
            @delete="$emit('refresh')"
          />
        </td>
      </tr>
    </tbody>
  </AdminTable>
</template>

<script setup lang="ts">
import AdminBadge from '../../../components/AdminBadge/AdminBadge.vue'
import AdminTable from '../../../components/AdminTable/Table/AdminTable.vue'
import AdminTableTh from '../../../components/AdminTable/Table/AdminTableTh.vue'
import AdminContentWithTooltip from '../../../components/AdminContentWithTooltip/AdminContentWithTooltip.vue'
import type { ContactPoint } from '~/types/types'

defineProps<{
  contactPoints: Array<ContactPoint>
}>()

const emit = defineEmits<{
  (event: 'refresh'): void
}>()

const config = useRuntimeConfig()
const { t } = useI18n()
const { toast } = useToast()

const loading = ref(false)
async function updateContactPoint(contactPoint: ContactPoint, closeModal: () => void, contactForm: ContactPointForm) {
  loading.value = true

  try {
    // await saveResourceForm(communityResource.dataset, contactForm)
    emit('refresh')
    closeModal()
  }
  finally {
    loading.value = false
  }

  toast.success(t('Contact point updated!'))
}
</script>
