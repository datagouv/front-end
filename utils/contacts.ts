import type { Organization } from '@datagouv/components-next'
import type { $Fetch } from 'ofetch'
import type { ContactPoint, NewContactPoint } from '~/types/types'

export const defaultContactForm = {
  name: '',
  email: '',
  contact_form: '',
  role: 'contact',
}

export async function newContactPoint(api: $Fetch, organization: Organization, contactPoint: NewContactPoint): Promise<ContactPoint> {
  return await api<ContactPoint>('/api/1/contacts/', {
    method: 'POST',
    body: JSON.stringify({
      name: contactPoint.name,
      email: contactPoint.email,
      contact_form: contactPoint.contact_form,
      role: contactPoint.role,
      organization: organization.id,
    }),
  })
}
