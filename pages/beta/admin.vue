<template>
  <div class="fr-grid-row bg-gray-100 flex-1">
    <div class="fr-col-12 fr-col-md-4 fr-col-lg-3 fr-col-xl-2">
      <nav
        class="fr-sidemenu !mx-0 !p-0 md:h-full"
        :aria-label="t('Administration menu')"
      >
        <ClientOnly>
          <Disclosure
            :default-open="true"
            as="div"
            class="fr-sidemenu__inner !py-2 !px-0 md:!p-0 !bg-white !shadow-[1px_0_0_0_var(--border-default-grey)] md:h-full"
          >
            <DisclosureButton
              class="fr-sidemenu__btn after:!mr-0"
              hidden
            >
              {{ t('Open menu') }}
            </DisclosureButton>
            <DisclosurePanel>
              <AccordionGroup
                v-if="me"
                class="fr-sidemenu__list"
                as="ul"
              >
                <AdminSidebarMenu
                  :user="me"
                  :default-open="defaultOpenId === me.id"
                />
                <AdminSidebarMenu
                  v-for="organization in organizations"
                  :key="organization.id"
                  :organization="organization"
                  :default-open="defaultOpenId === organization.id"
                />
                <AdminSidebarMenu
                  v-if="isSiteAdmin"
                  :default-open="false"
                />
              </AccordionGroup>
            </DisclosurePanel>
          </Disclosure>
        </ClientOnly>
      </nav>
    </div>
    <div class="fr-col-12 fr-col-md-8 fr-col-lg-9 fr-col-xl-10 h-full !px-4 sm:!px-10 pb-64">
      <Well
        color="blue-cumulus"
        weight="regular"
        class="mt-6"
      >
        <div class="flex space-x-8">
          <div class="flex items-center space-x-2">
            <RiInformationLine class="size-6 -mt-0.5" />
            <div>{{ t("You're on the new admin interface in beta.") }}</div>
          </div>
          <div class="space-x-4">
            <a
              class="fr-link fr-link--external"
              :href="config.public.betaAdminFeedbackUrl"
              target="_blank"
            >
              {{ $t('Give your opinion') }}
            </a>
            <a
              class="fr-link fr-link--external"
              :href="`/${locale}/admin`"
            >
              {{ $t('Go back to the old admin') }}
            </a>
          </div>
        </div>
      </Well>
      <NuxtPage
        :page-key="route => route.fullPath"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Well } from '@datagouv/components'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { RiInformationLine } from '@remixicon/vue'
import AdminSidebarMenu from '~/components/AdminSidebar/AdminSidebarMenu/AdminSidebarMenu.vue'

definePageMeta({
  layout: 'fluid',
  middleware: ['auth'],
})

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const localeRoute = useLocaleRoute()
const me = useMe()
const { locale } = useI18n()
const config = useRuntimeConfig()

useHead({ title: 'Admin' })

// Works only because we are using MongoDB and there is no
// collision between orgs' IDs and users' IDs.

const { organizations, currentOrganization } = await useOrganizations()
const defaultOpenId = ref<null | string>(currentOrganization.value?.id || null)

const isSiteAdmin = computed(() => me.value.roles?.includes('admin') || false)

if (route.name === localeRoute('/beta/admin/')?.name) {
  if (me.value.organizations.length > 0) {
    await navigateTo(localePath(`/beta/admin/organizations/${me.value.organizations[0].id}/datasets`), { replace: true })
  }
  else {
    await navigateTo(localePath('/beta/admin/me/datasets'), { replace: true })
  }
}

watchEffect(() => {
  if (currentOrganization.value) {
    defaultOpenId.value = currentOrganization.value.id
  }
  else if (route.path.includes('/me')) {
    defaultOpenId.value = me.value.id
  }
  else {
    defaultOpenId.value = null
  }
})
</script>

<style>
html, body {
  height: 100%;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.fr-sidemenu .fr-sidemenu__item:first-child:before, .fr-sidemenu .fr-sidemenu__item:last-child:before, .fr-sidemenu .fr-sidemenu__item:before {
  box-shadow: none;
}
</style>
