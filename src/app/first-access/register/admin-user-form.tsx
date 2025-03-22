/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'

interface AdminUserFormProps {
  formData: {
    adminName: string
    adminEmail: string
    adminPassword: string
  }
  errors?: any

  updateFormData: (data: Partial<AdminUserFormProps['formData']>) => void
}

export default function AdminUserForm({
  formData,
  updateFormData,
  errors,
}: AdminUserFormProps) {
  const staggerItems = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <motion.div
      className="space-y-4"
      variants={staggerItems}
      initial="hidden"
      animate="show"
    >
      <pre>{JSON.stringify(errors, null, 2)}</pre>
      <motion.div className="space-y-2" variants={item}>
        <Label htmlFor="adminName">Admin Name</Label>
        <Input
          id="adminName"
          placeholder="Enter admin name"
          value={formData.adminName}
          onChange={(e) => updateFormData({ adminName: e.target.value })}
          required
          className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
        />
      </motion.div>

      <motion.div className="space-y-2" variants={item}>
        <Label htmlFor="adminEmail">Admin Email</Label>
        <Input
          id="adminEmail"
          type="email"
          placeholder="Enter admin email"
          value={formData.adminEmail}
          onChange={(e) => updateFormData({ adminEmail: e.target.value })}
          required
          className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
        />
      </motion.div>

      <motion.div className="space-y-2" variants={item}>
        <Label htmlFor="adminPassword">Password</Label>
        <Input
          id="adminPassword"
          type="password"
          placeholder="Create a password"
          value={formData.adminPassword}
          onChange={(e) => updateFormData({ adminPassword: e.target.value })}
          required
          className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
        />
        <motion.p
          className="text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Password must be at least 8 characters and include a number and a
          special character.
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
