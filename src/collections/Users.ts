import type { CollectionConfig } from "payload"
import { isSuperAdmin } from "../access/isSuperAdmin"
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields"
import { authenticated } from '../access/authenticated'
import { setCookieBasedOnDomain } from './UsersHooks/hooks/setCookieBasedOnDomain'

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  tenantsCollectionSlug: 'tenants',
  arrayFieldAccess: {},
  tenantFieldAccess: {},
  rowFields: [
    {
      name: 'roles',
      type: 'select',
      defaultValue: ['tenant-viewer'],
      hasMany: true,
      options: ['tenant-admin', 'tenant-viewer'],
      required: true,
      access: {
        update: ({ req }: any) => {
          const { user } = req
          if (!user) {
            return false
          }

          if (isSuperAdmin(user)) {
            return true
          }

          return false
        },
      },
    },
  ],
})

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: "name",
  },

  auth: {
    useAPIKey: true,
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      options: ['super-admin', 'user'],
      access: {
        update: () => true,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterLogin: [setCookieBasedOnDomain],
  },
}