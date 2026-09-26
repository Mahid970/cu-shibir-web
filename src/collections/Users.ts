import type { CollectionConfig } from 'payload'

import { adminFieldOnly, hasRole, isAdmin, ROLES, type Role } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { bn: 'ব্যবহারকারী', en: 'User' },
    plural: { bn: 'ব্যবহারকারী', en: 'Users' },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'roles'],
    group: { bn: 'প্রশাসন', en: 'Administration' },
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 8 * 60 * 60,
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    // Staff can read their own record; admins can read everyone.
    read: ({ req }) => (hasRole(req.user as never, 'admin') ? true : { id: { equals: req.user?.id } }),
    update: ({ req }) => (hasRole(req.user as never, 'admin') ? true : { id: { equals: req.user?.id } }),
    admin: ({ req }) => Boolean((req.user as { roles?: Role[] } | null)?.roles?.length),
  },
  hooks: {
    beforeChange: [
      // The very first account becomes super-admin so the CMS can be bootstrapped.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        if (totalDocs === 0) data.roles = ['super-admin']
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: { bn: 'নাম', en: 'Name' } },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['contributor'],
      label: { bn: 'দায়িত্ব (রোল)', en: 'Roles' },
      options: ROLES.map((r) => ({ value: r.value, label: r.label })),
      access: { create: adminFieldOnly, update: adminFieldOnly },
      saveToJWT: true,
    },
  ],
}
