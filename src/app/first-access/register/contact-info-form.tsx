/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getAddressForZipCodeAction } from './_action'
import { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'
import { PhoneInput } from '@/components/phone-input'
import { useSession } from 'next-auth/react'

interface ContactInfoFormProps {
  formData: {
    address: string
    city: string
    state: string
    zipCode: string
    phone: string
    website: string
    ownerId: string
  }
  errors?: any
  updateFormData: (data: Partial<ContactInfoFormProps['formData']>) => void
}

export default function ContactInfoForm({
  formData,
  updateFormData,
  errors,
}: ContactInfoFormProps) {
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')

  const [phone, setPhone] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['get-address-for-zip-code', formData.zipCode],
    queryFn: () => getAddressForZipCodeAction(formData.zipCode),
    enabled: formData.zipCode.length === 8,
  })

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

  const { data: session } = useSession()

  useEffect(() => {
    if (data && !error) {
      setAddress(data.street)
      setCity(data.city)
      setState(data.state)
    }
    if (
      (data && address !== formData.address) ||
      city !== formData.city ||
      state !== formData.state
    ) {
      updateFormData({ address, city, state })
    }
    updateFormData({ ownerId: session?.user?.id as string })
  }, [data, error, updateFormData, address, city, state, formData, session])

  return (
    <motion.div
      className="space-y-4"
      variants={staggerItems}
      initial="hidden"
      animate="show"
    >
      <motion.div className="space-y-2" variants={item}>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
        <Label htmlFor="address">Endereço</Label>
        <div className="relative">
          <div className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground">
            {isLoading && <Loader className="h-4 w-4 animate-spin " />}
          </div>
          <Input
            id="address"
            placeholder="Digite o endereço"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
            disabled
          />
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-2 gap-4" variants={item}>
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <div className="relative">
            <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
              {isLoading && <Loader className="h-4 w-4 animate-spin" />}
            </div>
            <Input
              id="city"
              placeholder="Digite a cidade"
              value={formData.city}
              onChange={(e) => updateFormData({ city: e.target.value })}
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
              disabled
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <div className="relative">
            <div className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground">
              {isLoading && <Loader className="h-4 w-4 animate-spin " />}
            </div>
            <Input
              id="state"
              placeholder="Digite o estado"
              value={formData.state}
              onChange={(e) => updateFormData({ state: e.target.value })}
              className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
              disabled
            />
          </div>
        </div>
      </motion.div>

      <motion.div className="space-y-2 grid grid-cols-2 gap-4" variants={item}>
        <div className="space-y-2">
          <Label htmlFor="zipCode">CEP</Label>
          <Input
            id="zipCode"
            placeholder="Digite o CEP"
            value={formData.zipCode}
            onChange={(e) => {
              updateFormData({ zipCode: e.target.value })
            }}
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-2">
          <PhoneInput
            value={phone}
            onChange={(e: string) => {
              setPhone(e)
              updateFormData({ phone })
            }}
          />
        </div>
      </motion.div>

      <motion.div className="space-y-2" variants={item}>
        <Label htmlFor="website">Site (opcional)</Label>
        <Input
          id="website"
          type="url"
          placeholder="https://exemplo.com"
          value={formData.website}
          onChange={(e) => updateFormData({ website: e.target.value })}
          className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
        />
      </motion.div>
    </motion.div>
  )
}
