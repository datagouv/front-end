<template>
  <div>
    <Breadcrumb>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/beta/admin"
        >
          {{ t('Administration') }}
        </NuxtLinkLocale>
      </li>
      <template v-if="harvester">
        <li v-if="harvester.organization">
          <NuxtLinkLocale
            class="fr-breadcrumb__link"
            :to="`/beta/admin/organizations/${harvester.organization.id}/profile`"
          >
            {{ harvester.organization.name }}
          </NuxtLinkLocale>
        </li>
        <li v-if="harvester.organization">
          <NuxtLinkLocale
            class="fr-breadcrumb__link"
            :to="`/beta/admin/organizations/${harvester.organization.id}/harvesters`"
          >
            {{ t('Harvesters') }}
          </NuxtLinkLocale>
        </li>
        <template v-if="job">
          <li>
            <NuxtLinkLocale
              class="fr-breadcrumb__link"
              :to="getHarvesterAdminUrl(harvester)"
            >
              {{ harvester.name }}
            </NuxtLinkLocale>
          </li>
          <li>
            <a
              class="fr-breadcrumb__link"
              aria-current="page"
            >
              {{ job.id }}
            </a>
          </li>
        </template>
        <li v-else>
          <a
            class="fr-breadcrumb__link"
            aria-current="page"
          >
            {{ harvester.name }}
          </a>
        </li>
      </template>
    </Breadcrumb>

    <div v-if="harvester && !job">
      <div class="mb-5">
        <div class="flex items-center justify-between mb-3">
          <h1 class="fr-h3 !mb-0">
            {{ harvester.name }}
          </h1>
          <BrandedButton
            v-if="harvester.validation.state === 'accepted'"
            :icon="RiPlayLargeLine"
            size="xs"
            :loading
            @click="run"
          >
            {{ $t('Run') }}
          </BrandedButton>
        </div>

        <div class="text-sm text-mentionGrey space-y-1.5">
          <div class="space-x-1">
            <RiToolsLine class="inline size-3" />
            <span>{{ $t('Implementation:') }}</span>
            <span class="font-mono">{{ harvester.backend }}</span>
          </div>
          <div class="space-x-1">
            <RiLink class="inline size-3" />
            <span>{{ $t('URL:') }}</span>
            <span class="font-mono">{{ harvester.url }}</span>
          </div>
          <div class="space-x-1">
            <RiCalendarEventLine class="inline size-3" />
            <span>{{ $t('Schedule:') }}</span>
            <span class="font-mono">{{ harvester.schedule || 'N/A' }}</span>
          </div>
          <div
            v-if="harvester.validation.state !== 'accepted'"
            class="space-x-1"
          >
            <RiCheckboxCircleLine class="inline size-3" />
            <span>{{ $t('Status:') }}</span>
            <AdminBadge
              v-if="harvester.validation.state === 'pending'"
              type="secondary"
              size="xs"
            >
              {{ $t('Waiting validation') }}
            </AdminBadge>
            <AdminBadge
              v-if="harvester.validation.state === 'refused'"
              type="danger"
              size="xs"
            >
              {{ $t('Refused') }}
            </AdminBadge>
          </div>
        </div>
      </div>

      <TabLinks
        class="mb-5"
        :links="[
          { href: getHarvesterAdminUrl(harvester), label: t('Jobs') },
          // { href: `${getharvesterAdminUrl(harvester)}/files`, label: t('Files') },
        ]"
      />
    </div>

    <NuxtPage :page-key="route => route.fullPath" />
  </div>
</template>

<script setup lang="ts">
import { RiCalendarEventLine, RiCheckboxCircleLine, RiLink, RiPlayLargeLine, RiToolsLine } from '@remixicon/vue'
import TabLinks from '~/components/TabLinks.vue'
import type { HarvesterJob, HarvesterSource } from '~/types/harvesters'

const { t } = useI18n()
const { $api } = useNuxtApp()
const { toast } = useToast()

const route = useRoute()
const url = computed(() => `/api/1/harvest/source/${route.params.id}`)
const { data: harvester } = await useAPI<HarvesterSource>(url, { lazy: true })
const job = ref<HarvesterJob | null>(null)
watchEffect(async () => {
  if (!harvester.value) return
  if (!route.params.jobid) return

  job.value = await $api(`/api/1/harvest/job/${route.params.jobid}/`)
})

const loading = ref(false)
const run = async () => {
  loading.value = true

  try {
    await $api(`/api/1/harvest/source/${route.params.id}/run`, {
      method: 'POST',
    })
    toast.success(t('The run is scheduled'))
  }
  finally {
    loading.value = false
  }
}
</script>
