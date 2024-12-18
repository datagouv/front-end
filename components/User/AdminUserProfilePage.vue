<template>
  <div>
    <Breadcrumb>
      <li>
        <NuxtLinkLocale
          class="fr-breadcrumb__link"
          to="/beta/admin"
        >
          {{ $t('Administration') }}
        </NuxtLinkLocale>
      </li>
      <li>
        <a
          class="fr-breadcrumb__link"
          aria-current="page"
        >
          {{ $t('Profile') }}
        </a>
      </li>
    </Breadcrumb>
    <h1 class="fr-h3 !mb-5">
      {{ $t("Profile") }}
    </h1>
    <PaddedContainer class="!p-5">
      <div class="flex items-center">
        <div class="flex-none">
          <Avatar
            :user="me"
            :rounded="true"
            :size="80"
          />
        </div>
        <h2 class="flex-1 !ml-3 !mb-0 fr-h3">
          {{ me.first_name }} {{ me.last_name }}
        </h2>
        <div class="flex-none">
          <BrandedButton
            size="xs"
            color="secondary"
            as="a"
            :href="me.page"
            :icon="RiEyeLine"
          >
            {{ $t('See public profile') }}
          </BrandedButton>
        </div>
      </div>
    </PaddedContainer>
    <h2 class="uppercase !text-sm !my-5">
      {{ $t('Edit Profile') }}
    </h2>
    <PaddedContainer class="!p-5">
      <fieldset class="fr-grid-row fr-grid-row--gutters">
        <InputGroup
          v-model="me.first_name"
          class="fr-col"
          autocomplete="given-name"
          :label="$t('First name')"
          :required="true"
          :spellcheck="false"
        />
        <InputGroup
          v-model="me.last_name"
          class="fr-col"
          autocomplete="family-name"
          :label="$t('Last name')"
          :required="true"
          :spellcheck="false"
        />
      </fieldset>
      <InputGroup
        v-model="me.about"
        class="fr-col"
        :label="$t('Biography')"
        type="markdown"
      />
      <InputGroup
        v-model="me.website"
        class="fr-col"
        :label="$t('Website')"
        type="url"
      />
      <UploadGroup
        :label="$t('Profile picture')"
        type="drop"
        accept=".jpeg, .jpg, .png"
        :hint-text="$t('Max size: 4Mo. Accepted formats: JPG, JPEG, PNG')"
        :show-label="true"
        @change="setFiles"
      />
      <div
        v-if="imagePreview"
        class="text-align-center"
      >
        <NuxtImg
          :src="imagePreview"
          class="border mx-auto max-h-40"
          loading="lazy"
          alt=""
        />
      </div>
      <div class="flex justify-end">
        <BrandedButton
          size="xs"
          :disabled="loading"
          :icon="RiSaveLine"
          @click="updateMe"
        >
          {{ $t('Save') }}
        </BrandedButton>
      </div>
      <div class="fr-input-group">
        <label
          class="fr-label"
          :for="apiKeyId"
        >
          {{ $t('API Key') }}
          <span class="fr-hint-text">
            {{ $t('Warning: If you erase your API key you risk to loose acces to {site} services', { site: config.public.title }) }}
          </span>
        </label>
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-12 fr-col-sm">
            <div class="fr-input-wrap relative">
              <input
                :id="apiKeyId"
                v-model="me.apikey"
                class="fr-input !pr-12"
                disabled
                type="text"
              >
              <CopyButton
                v-if="me.apikey"
                class="absolute right-1 top-1 !mt-0.5 !mr-0.5"
                :label="$t('Copy API key')"
                :copied-label="$t('API key copied')"
                :text="me.apikey"
                :hide-label="true"
              />
            </div>
          </div>
          <div class="fr-col-auto flex gap-4">
            <div class="flex-none">
              <BrandedButton
                color="secondary"
                size="xs"
                :disabled="loading"
                :icon="RiRecycleLine"
                @click="regenerateApiKey"
              >
                {{ $t('Regenerate') }}
              </BrandedButton>
            </div>
            <div class="flex-none">
              <BrandedButton
                color="danger"
                size="xs"
                :disabled="loading"
                :icon="RiDeleteBin6Line"
                @click="deleteApiKey"
              >
                {{ $t('Delete') }}
              </BrandedButton>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-input-group">
        <label
          class="fr-label mb-2"
          :for="emailId"
        >
          {{ $t('E-mail address') }}
        </label>
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-12 fr-col-sm-7 fr-col-lg-8 fr-col-xl-9">
            <div class="fr-input-wrap relative">
              <input
                :id="emailId"
                v-model="me.email"
                class="fr-input"
                disabled
                type="text"
              >
            </div>
          </div>
          <div class="fr-col-auto">
            <BrandedButton
              color="secondary"
              size="xs"
              as="a"
              :href="`${config.public.apiBase}/${config.public.changeEmailPage}`"
              :icon="RiEditLine"
            >
              {{ $t('Change e-mail address') }}
            </BrandedButton>
          </div>
        </div>
      </div>
      <div class="fr-input-group">
        <label
          class="fr-label mb-2"
          :for="passwordId"
        >
          {{ $t('Password') }}
        </label>
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-12 fr-col-sm-7 fr-col-lg-8 fr-col-xl-9">
            <div class="fr-input-wrap relative">
              <input
                :id="passwordId"
                value="**********"
                class="fr-input"
                disabled
                type="password"
              >
            </div>
          </div>
          <div class="fr-col-auto">
            <BrandedButton
              color="secondary"
              size="xs"
              as="a"
              :href="`${config.public.apiBase}/${config.public.changePasswordPage}`"
              :icon="RiEditLine"
            >
              {{ $t('Change password') }}
            </BrandedButton>
          </div>
        </div>
      </div>
      <BannerAction
        type="danger"
        :title="$t('Delete the account')"
      >
        {{ $t("Be careful, this action can't be reverse.") }}

        <template #button>
          <ModalWithButton
            :title="$t('Are you sure you want to delete this organization ?')"
            size="lg"
          >
            <template #button="{ attrs, listeners }">
              <BrandedButton
                color="danger"
                size="xs"
                :icon="RiDeleteBin6Line"
                v-bind="attrs"
                v-on="listeners"
              >
                {{ $t('Delete') }}
              </BrandedButton>
            </template>
            <template #default>
              <p class="fr-text--bold">
                {{ $t("This action can't be reverse.") }}
              </p>
              <p>{{ $t("All content published with this organization will stay online, with the same URL but in an anonymous form, i.e. without being linked to a data producer.") }}</p>
              <p>{{ $t("If you want to delete your published content too, start by deleting the contents before deleting your account.") }}</p>
            </template>
            <template #footer>
              <div class="flex-1 fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-lg fr-btns-group--icon-left">
                <BrandedButton
                  color="danger"
                  :disabled="loading"
                  @click="deleteUser"
                >
                  {{ $t("Delete your account") }}
                </BrandedButton>
              </div>
            </template>
          </ModalWithButton>
        </template>
      </BannerAction>
    </PaddedContainer>
  </div>
</template>

<script setup lang="ts">
import { Avatar, CopyButton } from '@datagouv/components'
import { RiDeleteBin6Line, RiEditLine, RiEyeLine, RiRecycleLine, RiSaveLine } from '@remixicon/vue'
import { uploadProfilePicture } from '~/api/users'

const me = useMe()
const config = useNuxtApp().$config
const { toast } = useToast()
const { t } = useI18n()
const { $api } = useNuxtApp()

const apiKeyId = useId()
const emailId = useId()
const passwordId = useId()

const loading = ref(false)

const profilePicture = ref<File | null>(null)

watchEffect(() => {
  if (me.value.about === null) {
    me.value.about = ''
  }
})

const setFiles = (files: Array<File>) => {
  profilePicture.value = files[0]
}

const imagePreview = computed(() => {
  if (!profilePicture.value) return null
  if (typeof profilePicture.value === 'string') return profilePicture.value
  return URL.createObjectURL(profilePicture.value)
})

async function updateMe() {
  loading.value = true
  if (profilePicture.value) {
    try {
      await uploadProfilePicture(profilePicture.value)
    }
    catch {
      toast.error(t(`Your profile picture couldn't be updated !`))
    }
  }
  try {
    me.value = await $api<Me>('/api/1/me/', {
      method: 'PUT',
      body: {
        first_name: me.value.first_name,
        last_name: me.value.last_name,
        about: me.value.about,
        website: me.value.website,
      },
    })
    toast.success(t('Profile updated !'))
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }
  finally {
    loading.value = false
  }
}

async function regenerateApiKey() {
  loading.value = true
  try {
    const res = await $api<{ apikey: string }>('/api/1/me/apikey', {
      method: 'POST',
    })
    me.value.apikey = res.apikey
  }
  finally {
    loading.value = false
  }
}

async function deleteApiKey() {
  loading.value = true
  try {
    await $api('/api/1/me/apikey', {
      method: 'DELETE',
    })
    me.value.apikey = null
  }
  finally {
    loading.value = false
  }
}

async function deleteUser() {
  loading.value = true
  try {
    await $api('/api/1/me/', {
      method: 'DELETE',
    })
    navigateTo(`${config.public.apiBase}/en/logout`, { external: true })
  }
  finally {
    loading.value = false
  }
}
</script>
