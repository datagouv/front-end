<template>
  <AdminTable :loading>
    <thead>
      <AdminTableTh
        @sort="(direction: SortDirection) => $emit('sort', 'title', direction)"
        :sorted="sorted('title')"
        scope="col"
      >
        {{ t("Resource title") }}
      </AdminTableTh>
      <AdminTableTh>
        {{ t("Status") }}
      </AdminTableTh>
      <AdminTableTh>
        {{ t("Format") }}
      </AdminTableTh>
      <AdminTableTh
        @sort="(direction: SortDirection) => $emit('sort', 'created_at_internal', direction)"
        :sorted="sorted('created_at_internal')"
        scope="col"
      >
        {{ t("Created at") }}
      </AdminTableTh>
      <AdminTableTh
        @sort="(direction: SortDirection) => $emit('sort', 'last_modified_internal', direction)"
        :sorted="sorted('last_modified_internal')"
        scope="col"
      >
        {{ t("Modified at") }}
      </AdminTableTh>
    </thead>
    <tbody>
      <tr v-for="communityResource in communityResources">
        <td>
          <AdminContentWithTooltip class="fr-text--bold">
            <a class="fr-link fr-reset-link" :href="getCommunityResourceLinkToAdmin(communityResource)">
              <TextClamp :text="communityResource.title" :auto-resize="true" :max-lines="2"/>
            </a>
          </AdminContentWithTooltip>
          <p v-if="communityResource.dataset">
            <a
              class="fr-link inline-flex"
              :href="communityResource.dataset.page"
            >
              <Icon
                name="ri:database-2-line"
                class="self-center size-3"
                aria-hidden="true"
              />
              <TextClamp
                class="overflow-wrap-anywhere"
                :text="communityResource.dataset.title"
                :auto-resize="true"
                :max-lines="1"
              />
            </a>
          </p>
        </td>
        <td>
          <AdminBadge :type="getStatus(communityResource).type">{{ getStatus(communityResource).label }}</AdminBadge>
        </td>
        <td>
          <code class="fr-p-1v font-mono bg-grey-100 fr-text--sm text-mention-grey rounded-xxs">{{ communityResource.format }}</code>
        </td>
        <td>{{ formatDate(communityResource.created_at) }}</td>
        <td>{{ formatDate(communityResource.last_modified) }}</td>
      </tr>
    </tbody>
  </AdminTable>
</template>
<script setup lang="ts">
import { formatDate } from '@datagouv/components';
import type { CommunityResource, Dataset } from '@datagouv/components';
import { useI18n } from 'vue-i18n';
import AdminBadge from '../../../components/AdminBadge/AdminBadge.vue';
import AdminTable from '../../../components/AdminTable/Table/AdminTable.vue';
import AdminTableTh from '../../../components/AdminTable/Table/AdminTableTh.vue';
import AdminContentWithTooltip from '../../../components/AdminContentWithTooltip/AdminContentWithTooltip.vue';
import { ref, watchEffect } from 'vue';
import TextClamp from '~/components/TextClamp.vue';
import type { AdminBadgeState, CommunityResourceSortedBy, SortDirection } from '~/types/types';

const props = defineProps<{
  communityResources: Array<CommunityResource>;
  loading: boolean;
  sortedBy: CommunityResourceSortedBy;
  sortDirection: SortDirection;
}>();

defineEmits<{
  (event: 'sort', column: CommunityResourceSortedBy, direction: SortDirection): void
}>();

const config = useRuntimeConfig()
const { t } = useI18n();

function sorted(column: CommunityResourceSortedBy) {
  if(props.sortedBy === column) {
    return props.sortDirection;
  }
  return null;
}

function getCommunityResourceLinkToAdmin(communityResource: CommunityResource) {
  return `${config.public.apiBase}/en/admin/dataset/${communityResource.dataset.id}/community-resource/${communityResource.id}/`;
}

function getStatus(communityResource: CommunityResource): {label: string, type: AdminBadgeState} {
  const checked = communityResource.extras && 'check:available' in communityResource.extras;
  if (checked && communityResource.extras['check:available'] === false) {
    return {
      label: t("Unavailable"),
      type: "error"
    };
  } else if (checked) {
    return {
      label: t("Available"),
      type: "info"
    };
  } else {
    return {
      label: t("Not checked yet"),
      type: "default"
    };
  }
}
</script>
