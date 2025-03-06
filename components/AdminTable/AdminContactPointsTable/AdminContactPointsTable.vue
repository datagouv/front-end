<template>
  <AdminTable>
    <thead>
      <AdminTableTh scope="col">
        {{ t("Contact point name") }}
      </AdminTableTh>
      <AdminTableTh class="w-44">
        {{ t("Role") }}
      </AdminTableTh>
      <AdminTableTh>
        {{ t("Contact Email") }}
      </AdminTableTh>
      <AdminTableTh
        scope="col"
      >
        {{ t("Contact Url") }}
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
        v-for="contactPoint in contactPoints"
        :key="contactPoint.id"
      >
        <td class="font-bold">
          {{ contactPoint.name }}
        </td>
        <td>
          <AdminBadge
            size="xs"
            type="secondary"
          >
            {{ getRoleLabel(contactPoint) }}
          </AdminBadge>
        </td>
        <td>
          {{ contactPoint.email }}
        </td>
        <td>
          <div class="break-all truncate">
            {{ contactPoint.contact_form }}
          </div>
        </td>
        <td>
          <ModalWithButton
            :title="$t('Edit the contact point')"
            size="lg"
            @open="newContactForm = contactPoint"
            @close="newContactForm = null"
          >
            <template #button="{ attrs, listeners }">
              <BrandedButton
                color="secondary-softer"
                :icon="RiPencilLine"
                icon-only
                size="xs"
                keep-margins-even-without-borders
                v-bind="attrs"
                v-on="listeners"
              >
                {{ $t('Transfer') }}
              </BrandedButton>
            </template>
            <div class="space-y-4">
              <RequiredExplanation />
              <InputGroup
                v-model="newContactForm.name"
                required
                :label="t('Name')"
                placeholder="e.g. the service name"
                :has-error="!!getFirstError('name')"
                :error-text="getFirstError('name')"
                @blur="touch('name')"
              />
              <SelectGroup
                v-model="newContactForm.role"
                :options
                required
                :label="t('Role')"
                @blur="touch('role')"
              />
              <InputGroup
                v-model="newContactForm.email"
                type="email"
                :label="t('Email')"
                placeholder="contact@organization.org"
                @blur="touch('email')"
              />
              <InputGroup
                v-model="newContactForm.contact_form"
                type="url"
                :label="t('Link')"
                placeholder="https://..."
                @blur="touch('contact_form')"
              />
            </div>
            <template #footer="{ close }">
              <div class="flex-1 flex justify-end">
                <BrandedButton
                  color="primary"
                  :loading
                  @click="updateContactPoint(close)"
                >
                  {{ $t('Validation') }}
                </BrandedButton>
              </div>
            </template>
          </ModalWithButton>
        </td>
      </tr>
    </tbody>
  </AdminTable>
</template>

<script setup lang="ts">
import { BrandedButton, type Organization } from '@datagouv/components-next'
import { RiPencilLine } from '@remixicon/vue'
import AdminBadge from '~/components/AdminBadge/AdminBadge.vue'
import AdminTable from '~/components/AdminTable/Table/AdminTable.vue'
import AdminTableTh from '~/components/AdminTable/Table/AdminTableTh.vue'
import SelectGroup from '~/components/Form/SelectGroup/SelectGroup.vue'
import type { ContactPoint } from '~/types/types'

const props = defineProps<{
  contactPoints: Array<ContactPoint>
  organization: Organization
}>()

const emit = defineEmits<{
  (event: 'refresh'): void
}>()

const { $api } = useNuxtApp()

const { t } = useI18n()
const { toast } = useToast()

// TODO: use defaultContactForm
const { form: newContactForm, getFirstError, touch } = useForm({
  id: '',
  name: '',
  email: '',
  contact_form: '',
  role: 'contact',
} as ContactPoint, {
  id: [required()],
  name: [required()],
  email: [email()],
  contact_form: [url()],
  role: [required()],
}, {})

const loading = ref(false)

const roleKey = '/api/1/contacts/roles/'
const { data: rolesList } = await useAPI<Array<ContactType>>(roleKey, {
  key: roleKey,
  // getCachedData: getDataFromSSRPayload, add when available
})

const options = computed(() => rolesList.value?.map(r => ({
  label: r.label,
  value: r.id,
})) ?? [])

function getRoleLabel(contact: ContactPoint) {
  return rolesList.value?.find(role => role.id === contact.role)?.label
}

async function updateContactPoint(closeModal: () => void) {
  loading.value = true

  try {
    await saveContactPoint($api, props.organization, newContactForm.value)
    emit('refresh')
    closeModal()
  }
  finally {
    loading.value = false
  }

  toast.success(t('Contact point updated!'))
}
</script>
