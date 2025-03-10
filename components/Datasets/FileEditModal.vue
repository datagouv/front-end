<template>
  <ModalWithButton
    v-model="open"
    :title="t('File metadata')"
    size="fullscreen"
    @open="removeErrorsAndWarnings"
  >
    <template
      v-if="!openOnMounted"
      #button="{ attrs, listeners }"
    >
      <BrandedButton
        color="secondary-softer"
        v-bind="attrs"
        icon-only
        :icon="RiPencilLine"
        size="xs"
        keep-margins-even-without-borders
        v-on="listeners"
      >
        {{ $t("Edit file") }}
      </BrandedButton>
    </template>

    <template #default="{ close }">
      <form
        :id="formId"
        @submit.prevent="submit(close)"
      >
        <div class="flex">
          <Sidemenu
            class="w-5/12 hidden lg:block"
            :button-text="$t('Help')"
            :on-right="true"
            :show-border="false"
          >
            <template #title>
              <span
                class="fr-icon--sm fr-icon-question-line"
                aria-hidden="true"
              />
              {{ $t('Help') }}
            </template>
            <AccordionGroup>
              <Accordion
                v-if="isRemote"
                :id="chooseTheCorrectLinkAccordionId"
                :title="$t('Choose the correct link')"
                :state="accordionState('url')"
              >
                {{ $t("It's advised to put the link to the file itself instead of a web page to allow {site} to parse it.") }}
              </Accordion>
              <Accordion
                :id="nameAFileAccordionId"
                :title="nameAFile"
                :state="accordionState('title')"
              >
                <div class="prose prose-neutral fr-m-0">
                  <p class="fr-m-0 fr-mb-1w">
                    {{ $t("It is recommended to choose a title that can inform any user about the content of the file. Some practices to avoid:") }}
                  </p>
                  <ul>
                    <li>{{ $t('giving a too generic title (e.g., "list.csv");') }}</li>
                    <li>{{ $t("giving a too long title that would make the file manipulation difficult;") }}</li>
                    <li>{{ $t("giving a title containing accents or special characters (file interoperability issues);") }}</li>
                    <li>{{ $t("giving a title that is too technical and derived from business nomenclatures.") }}</li>
                  </ul>
                </div>
              </Accordion>
              <Accordion
                :id="chooseTheRightTypeOfFileAccordionId"
                :title="$t('Publish the correct file types')"
                :state="accordionState('type')"
              >
                <div class="prose prose-neutral fr-m-0">
                  <p class="fr-m-0 fr-mb-1w">
                    {{ $t("You can choose from the following types:") }}
                  </p>
                  <ul>
                    <li
                      v-for="fileType in fileTypes"
                      :key="fileType.value"
                    >
                      {{ fileType.label }}
                    </li>
                  </ul>
                </div>
              </Accordion>
              <Accordion
                :id="chooseTheCorrectFormatAccordionId"
                :title="$t('Choose the right format')"
                :state="accordionState('format')"
              >
                <div class="prose prose-neutral fr-m-0">
                  <p class="fr-m-0 fr-mb-1w">
                    {{ $t("The formats must be:") }}
                  </p>
                  <ul>
                    <li>{{ $t("open : an open format doesn't add technical specifications that restrict data use (i.e. using a paid software) ;") }}</li>
                    <li>{{ $t("easily reusable : a format easily reusable implies that anybody or server can reuse easily the dataset ;") }}</li>
                    <li>{{ $t("usable in an automated processing system : an automated processing system allows to make automatic operations, related to data exploitation (i.e. a CSV file is easily usable by an automated system unlike a PDF file).") }}</li>
                  </ul>
                </div>
              </Accordion>
              <Accordion
                :id="writeAGoodDescriptionAccordionId"
                :title="$t('Add documentation')"
                :state="accordionState('description')"
              >
                <div class="prose prose-neutral fr-m-0">
                  <p class="fr-m-0 fr-mb-1w">
                    {{ $t("The description of a file facilitates the reuse of data. It includes, among others:") }}
                  </p>
                  <ul>
                    <li>{{ $t("a general description of the dataset ;") }}</li>
                    <li>{{ $t("a description of the data production mode ;") }}</li>
                    <li>{{ $t("a description of the data model ;") }}</li>
                    <li>{{ $t("a description of the data schema ;") }}</li>
                    <li>{{ $t("a description of the metadata ;") }}</li>
                    <li>{{ $t("a description of major changes.") }}</li>
                  </ul>
                </div>
                <SimpleBanner
                  v-if="getFirstWarning('description')"
                  class="font-bold mt-2"
                  type="warning"
                >
                  {{ getFirstWarning("description") }}
                </SimpleBanner>
              </Accordion>
              <Accordion
                :id="selectASchemaAccordionId"
                :title="$t('Select a schema')"
                :state="accordionState('schema')"
              >
                <i18n-t
                  keypath="It is possible to identify an existing data schema by visiting the {schema} website, that references a list of existing data schema."
                  tag="p"
                  class="fr-m-0 fr-mb-1w"
                >
                  <template #schema>
                    <a :href="config.public.schemasSite.url">{{ config.public.schemasSite.name }}</a>
                  </template>
                </i18n-t>
              </Accordion>
            </AccordionGroup>
          </Sidemenu>
          <div class="w-full lg:w-7/12">
            <PaddedContainer class="overflow-auto">
              <fieldset
                class="fr-fieldset min-width-0"
                aria-labelledby="description-legend"
              >
                <legend
                  id="description-legend"
                  class="fr-fieldset__legend"
                >
                  <h2 class="text-sm font-bold uppercase mb-3">
                    {{ $t("File metadata") }}
                  </h2>
                </legend>
                <div class="fr-fieldset__element">
                  <FileCard
                    v-model="form"
                    class="mb-3"
                    :hide-actions="true"
                    :extensions
                  />
                </div>
                <RequiredExplanation class="px-2" />
                <LinkedToAccordion
                  v-if="form.filetype === 'remote'"
                  class="fr-fieldset__element min-width-0"
                  :accordion="chooseTheCorrectLinkAccordionId"
                  @blur="touch('url')"
                >
                  <InputGroup
                    v-model="form.url"
                    :label="$t('Link url')"
                    :required="true"
                    :has-error="!!getFirstError('url')"
                    :error-text="getFirstError('url')"
                  />
                </LinkedToAccordion>
                <div
                  v-if="form.filetype === 'file'"
                  class="fr-fieldset__element"
                >
                  <div v-if="newFile">
                    <label
                      class="fr-label fr-mb-1w"
                    >
                      {{ $t('The current file will be replaced by') }}
                    </label>
                    <FileCard
                      v-if="newFile"
                      :model-value="{
                        filetype: 'file',
                        title: newFile.name,
                        type: 'main',
                        description: '',
                        schema: null,
                        file: {
                          raw: newFile,
                          state: { status: 'waiting' },
                        },
                        resource: null,
                      }"
                      class="fr-mb-3v"
                      :show-edit-and-warning="false"
                      :extensions
                      @delete="newFile = null"
                    />
                  </div>
                  <UploadGroup
                    v-else
                    show-label
                    :label="$t('Replace file')"
                    type="drop"
                    :accept="extensions.join(',')"
                    :multiple="false"
                    :hint-text="$t('Max size: 420 Mb. Multiple files allowed.')"
                    @change="setFiles"
                  />
                </div>
                <LinkedToAccordion
                  class="fr-fieldset__element min-width-0"
                  :accordion="nameAFileAccordionId"
                  @blur="touch('title')"
                >
                  <InputGroup
                    v-model="form.title"
                    :label="fileTitle"
                    :required="true"
                    :has-error="!!getFirstError('title')"
                    :error-text="getFirstError('title')"
                  />
                </LinkedToAccordion>
                <LinkedToAccordion
                  class="fr-fieldset__element min-width-0"
                  :accordion="chooseTheRightTypeOfFileAccordionId"
                  @blur="touch('type')"
                >
                  <SelectGroup
                    v-model="form.type"
                    :label="$t('Type')"
                    :required="true"
                    :has-error="!!getFirstError('type')"
                    :error-text="getFirstError('type') || undefined"
                    :options="fileTypes"
                  />
                </LinkedToAccordion>
                <LinkedToAccordion
                  v-if="form.filetype === 'remote'"
                  class="fr-fieldset__element min-width-0"
                  :accordion="chooseTheCorrectFormatAccordionId"
                  @blur="touch('format')"
                >
                  <SearchableSelect
                    v-model="form.format"
                    :label="$t('Format')"
                    :placeholder="$t('Search a format…')"
                    :display-value="(option) => option"
                    :allow-new-option="(query) => query"
                    :options="extensions"
                    :multiple="false"
                    class="mb-6"
                    required

                    :error-text="getFirstError('format')"
                    :warning-text="getFirstWarning('format')"
                  />
                </LinkedToAccordion>
                <LinkedToAccordion
                  class="fr-fieldset__element min-width-0"
                  :accordion="writeAGoodDescriptionAccordionId"
                >
                  <InputGroup
                    v-model="form.description"
                    :label="$t('Description')"
                    :has-warning="!!getFirstWarning('description')"
                    :error-text="getFirstWarning('description')"
                    type="markdown"
                    @change="touch('description')"
                  />
                </LinkedToAccordion>
                <LinkedToAccordion
                  class="fr-fieldset__element min-width-0"
                  :accordion="selectASchemaAccordionId"
                  @blur="touch('schema')"
                >
                  <SearchableSelect
                    v-model="form.schema"
                    :label="$t('Schema')"
                    :placeholder="$t('Search a schema…')"
                    :display-value="(option) => option.name"
                    :get-option-id="(option) => option.name"
                    :options="schemas"
                    :multiple="false"

                    :error-text="getFirstError('schema')"
                    :warning-text="getFirstWarning('schema')"
                  />
                </LinkedToAccordion>
                <LinkedToAccordion
                  v-if="form.filetype === 'remote'"
                  class="fr-fieldset__element min-width-0"
                  :accordion="whatIsAMimeTypeAccordionId"
                  @blur="touch('mime')"
                >
                  <SearchableSelect
                    v-model="form.mime"
                    :label="$t('Mime type')"
                    :placeholder="$t('Search a mime type…')"
                    :display-value="(option) => option.text"
                    :get-option-id="(option) => option.text"
                    :allow-new-option="(query) => ({ text: query })"
                    :suggest="suggestMime"
                    :multiple="false"

                    :error-text="getFirstError('mime')"
                    :warning-text="getFirstWarning('mime')"
                  />
                </LinkedToAccordion>
              </fieldset>
            </PaddedContainer>
          </div>
        </div>
      </form>
    </template>

    <template #footer="{ close }">
      <div class="w-full">
        <div class="w-full flex gap-4">
          <BrandedButton
            color="primary"
            type="submit"
            :form="formId"
            :loading
          >
            {{ t('Validate') }}
          </BrandedButton>
          <BrandedButton
            color="secondary"
            :disabled="loading"
            @click="cancel(close)"
          >
            {{ t('Cancel') }}
          </BrandedButton>
        </div>

        <BannerAction
          v-if="dataset && form.resource"
          class="w-full mt-6"
          type="danger"
          :title="$t('Delete the resource')"
        >
          {{ $t("Be careful, this action can't be reverse.") }}
          <template #button>
            <ModalWithButton
              :title="$t('Are you sure you want to delete this resource?')"
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
              <p class="fr-text--bold">
                {{ $t("This action can't be reverse.") }}
              </p>
              <template #footer>
                <div class="flex-1 flex justify-end">
                  <BrandedButton
                    color="danger"
                    :loading="deleting"
                    @click="deleteResource(dataset, form.resource, close)"
                  >
                    {{ $t("Delete the resource") }}
                  </BrandedButton>
                </div>
              </template>
            </ModalWithButton>
          </template>
        </BannerAction>
      </div>
    </template>
  </ModalWithButton>
</template>

<script setup lang="ts">
import { BrandedButton } from '@datagouv/components-next'
import { getResourceLabel, RESOURCE_TYPE, SimpleBanner, type Dataset, type DatasetV2, type Resource, type SchemaResponseData } from '@datagouv/components-next'
import { cloneDeep } from 'lodash-es'
import { RiDeleteBin6Line, RiPencilLine } from '@remixicon/vue'
import ModalWithButton from '../Modal/ModalWithButton.vue'
import SelectGroup from '../Form/SelectGroup/SelectGroup.vue'
import type { ResourceForm } from '~/types/types'
import type { KeysOfUnion } from '~/composables/useForm'

const { t } = useI18n()
const config = useRuntimeConfig()
const { $api } = useNuxtApp()
const formId = useId()

const props = withDefaults(defineProps<{
  openOnMounted?: boolean
  loading?: boolean
  dataset?: Dataset | DatasetV2 | Omit<Dataset, 'resources' | 'community_resources'> // only require for deleting a resource :-(
  resource: ResourceForm
}>(), {
  loading: false,
  openOnMounted: false,
})
const emit = defineEmits<{
  (e: 'submit', close: () => void, file: ResourceForm): void
  (e: 'cancel' | 'delete'): void
}>()

// const file = defineModel<ResourceForm>({ required: true })
const open = ref(false)
const newFile = ref<File | null>(null)

onMounted(() => {
  if (props.openOnMounted) open.value = true
})

const isRemote = computed(() => props.resource.filetype === 'remote')
const nameAFile = computed(() => isRemote.value ? t('Name a link') : t('Name a file'))
const fileTitle = computed(() => isRemote.value ? t('Link title') : t('File title'))
const fileTypes = RESOURCE_TYPE.map(type => ({ label: getResourceLabel(type), value: type }))

const { form, getFirstError, getFirstWarning, touch, validate, removeErrorsAndWarnings } = useResourceForm(cloneDeep(props.resource))

const setFiles = (files: Array<File>) => {
  newFile.value = files[0]
}

const chooseTheCorrectLinkAccordionId = useId()
const nameAFileAccordionId = useId()
const chooseTheRightTypeOfFileAccordionId = useId()
const chooseTheCorrectFormatAccordionId = useId()
const writeAGoodDescriptionAccordionId = useId()
const selectASchemaAccordionId = useId()
const whatIsAMimeTypeAccordionId = useId()

const { data: extensions } = await useAPI<Array<string>>('/api/1/datasets/extensions/')
const { data: schemas } = await useAPI<SchemaResponseData>('/api/1/datasets/schemas/')

const submit = (close: () => void) => {
  if (validate()) {
    if (newFile.value) {
      if (form.value.filetype !== 'file') throw new Error('Cannot update file of not local file')

      form.value.file = {
        raw: newFile.value,
        state: { status: 'waiting' },
      }
    }

    emit('submit', close, form.value)
  }
}
const cancel = (close: () => void) => {
  form.value = props.resource
  close()
  emit('cancel')
}

const suggestMime = async (query: string) => {
  return await $api<Array<{ text: string }>>('/api/1/datasets/suggest/mime/', {
    query: {
      q: query,
      size: 5,
    },
  })
}
const accordionState = (key: KeysOfUnion<typeof form.value>) => {
  if (getFirstError(key)) return 'error'
  if (getFirstWarning(key)) return 'warning'

  return 'default'
}

const deleting = ref(false)
const deleteResource = async (dataset: Dataset | DatasetV2 | Omit<Dataset, 'resources' | 'community_resources'>, resource: Resource, close: () => void) => {
  deleting.value = true
  try {
    const { metadataUrl } = getResourcesUrls(dataset, resource)
    await $api(metadataUrl, { method: 'DELETE' })
    emit('delete')
  }
  finally {
    deleting.value = false
  }
  close()
}
</script>
