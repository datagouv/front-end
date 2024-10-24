<template>
  <HeadlessDisclosure v-slot="{ open }" :defaultOpen>
  <li class="fr-sidemenu__item" :class="{ 'fr-sidemenu__item--active': open }">
    <HeadlessDisclosureButton
      class="fr-sidemenu__btn"
      :aria-current="open"
    >
      <template v-if="user">
        <Avatar
          v-if="user"
          :user="user"
          :size="24"
          :rounded="true"
        />
        <p class="mx-2">
          {{ $t('My Profil') }}
        </p>
      </template>
      <template v-else-if="organization">
        <div class="logo logo--sm">
          <Placeholder
            type="organization"
            :src="organization.logo_thumbnail"
            :size="20"
          />
        </div>
        <p class="mx-2 fr-col text-ellipsis whitespace-nowrap overflow-hidden">
          {{ organization.name }}
        </p>
      </template>
    </HeadlessDisclosureButton>
    <HeadlessDisclosurePanel>
      <ul class="fr-sidemenu__list mx-2 my-3">
        <template v-if="user">
          <AdminSidebarLink
            icon="ri:account-circle-line"
            :label="$t('Me')"
            to="/newadmin/me"
          />
          <AdminSidebarLink
            icon="ri:database-2-line"
            :label="$t('Datasets')"
            to="/newadmin/me/datasets"
          />
          <AdminSidebarLink
            icon="ri:line-chart-line"
            :label="$t('Reuses')"
            to="/newadmin/me/reuses"
          />
          <AdminSidebarLink
            icon="ri:git-pull-request-line"
            :label="$t('Community Resources')"
            to="/newadmin/me/community-resources"
          />
        </template>
        <template v-else-if="organization">
          <AdminSidebarLink
            icon="ri:database-2-line"
            :label="$t('Datasets')"
            :to="`/newadmin/organizations/${organization.id}/datasets`"
            @click="$emit('click')"
          />
          <AdminSidebarLink
            icon="ri:line-chart-line"
            :label="$t('Reuses')"
            :to="`/newadmin/organizations/${organization.id}/reuses`"
            @click="$emit('click')"
          />
          <AdminSidebarLink
            icon="ri:chat-3-line"
            :label="$t('Discussions')"
            :to="`/newadmin/organizations/${organization.id}/discussions`"
            @click="$emit('click')"
          />
          <AdminSidebarLink
            icon="ri:parent-line"
            :label="$t('Members')"
            :to="{ name: 'organization-members', params: { oid: organization.id } }"
            @click="$emit('click')"
          />
          <AdminSidebarLink
            icon="ri:server-line"
            :label="$t('Harvesters')"
            :to="{ name: 'organization-harvesters', params: { oid: organization.id } }"
            @click="$emit('click')"
          />
          <AdminSidebarLink
            icon="ri:git-pull-request-line"
            :label="$t('Community Resources')"
            :to="`/newadmin/organizations/${organization.id}/community-resources`"
            @click="$emit('click')"
          />
          <AdminSidebarLink
            icon="ri:user-line"
            :label="$t('Profile')"
            :to="{ name: 'organization-profile', params: { oid: organization.id } }"
            @click="$emit('click')"
          />
        </template>
      </ul>
    </HeadlessDisclosurePanel>
  </li>
  </HeadlessDisclosure>
</template>

<script setup lang="ts">
import { Avatar, type Organization, type User } from '@datagouv/components'
import AdminSidebarLink from '~/components/AdminSidebar/AdminSidebarLink/AdminSidebarLink.vue'

defineProps<{
  /**
   * The logged in user, to show a menu with an avatar and "My Profil"
   */
  user?: User
  /**
   * An organization, to show a menu with its logo and name
   */
  organization?: Organization

  defaultOpen: boolean;
}>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.fr-sidemenu__btn {
  background-color: var(--background-alt-grey);
  border-bottom: 1px solid var(--border-default-grey);
  color: var(--text-default-grey);
}

.fr-sidemenu__btn:hover {
  background-color: var(--background-alt-grey-hover);
}

.fr-sidemenu__btn:active {
  background-color: var(--background-alt-grey-active);
}

.fr-sidemenu__btn[aria-current]:not([aria-current=false]) {
  background-color: var(--background-default-grey);
  color: var(--text-default-grey);
}

.fr-sidemenu__btn[aria-current]:not([aria-current=false])::before {
  width: 0;
}

.fr-sidemenu__btn[aria-current]:not([aria-current=false]):hover {
  background-color: var(--hover-tint);
}

.fr-sidemenu__btn[aria-current]:not([aria-current=false]):active {
  background-color: var(--active-tint);
}

.fr-sidemenu .fr-collapse {
  padding-left: 0;
  padding-right: 0;
  margin-left: 0;
  margin-right: 0;
}

.fr-sidemenu .fr-collapse.fr-collapse--expanded {
  border-bottom: 1px solid var(--border-default-grey);
}
</style>
