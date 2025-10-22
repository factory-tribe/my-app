import type { CollectionConfig } from 'payload'
import { isSuperAdminAccess } from '../access/isSuperAdmin'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tenant Name',
      admin: {
        description: 'The display name of the tenant',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug',
      admin: {
        description: 'URL-friendly identifier (e.g., "kasvi")',
      },
      validate: (value: any) => {
        if (typeof value !== 'string') {
          return 'Slug must be a string'
        }
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          return 'Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)'
        }
        return true
      },
    },
    {
      name: 'domain',
      type: 'text',
      required: true,
      unique: true,
      label: 'Domain',
      admin: {
        description: 'Full domain/subdomain (e.g., "kasvi.shopengenie.com")',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'allowPublicRead',
      type: 'checkbox',
      defaultValue: false,
      label: 'Allow Public Read',
      index: true,
      admin: {
        description: 'If checked, logging in is not required to read tenant data. Useful for building public pages.',
        position: 'sidebar',
      },
    },
  ],
}



