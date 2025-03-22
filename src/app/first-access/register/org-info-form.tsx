/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import type React from 'react'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { Upload, X } from 'lucide-react'
import { DynamicInput } from '@/components/dynamic-input'

interface OrganizationInfoFormProps {
  formData: {
    name: string
    lineOfActivity: string
    size: string
    logo: File | null
  }
  errors?: any
  updateFormData: (
    data: Partial<{
      name: string
      lineOfActivity: string
      size: string
      logo: File | null
    }>,
  ) => void
}

export default function OrganizationInfoForm({
  formData,
  updateFormData,
  errors,
}: OrganizationInfoFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const organizationsTypes: { id: number; label: string; value: string }[] = [
    { id: 1, label: 'Educação', value: 'educacao' },
    { id: 2, label: 'Saúde', value: 'saude' },
    { id: 3, label: 'Assistência Social', value: 'assistencia_social' },
    { id: 4, label: 'Tecnologia', value: 'tecnologia' },
    { id: 5, label: 'Indústria', value: 'industria' },
    { id: 6, label: 'Finanças', value: 'financas' },
    { id: 7, label: 'Comércio', value: 'comercio' },
    { id: 8, label: 'Comunicação', value: 'comunicacao' },
    { id: 9, label: 'Jurídico', value: 'juridico' },
    { id: 10, label: 'Turismo', value: 'turismo' },
    { id: 11, label: 'Outos', value: 'outros' },
  ]

  const organizationSize: { id: number; label: string; value: string }[] = [
    { id: 1, value: '1-10', label: '1-10 colaboradores' },
    { id: 2, value: '11-50', label: '11-50 colaboradores' },
    { id: 3, value: '51-200', label: '51-200 colaboradores' },
    { id: 4, value: '201-500', label: '201-500 colaboradores' },
    { id: 5, value: '501-1000', label: '501-1000 colaboradores' },
  ]

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateFormData({ logo: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    updateFormData({ logo: null })
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

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
      <motion.div className="space-y-2 p-1" variants={item}>
        <DynamicInput
          label="Nome"
          id="name"
          type="text"
          name="name"
          placeholder="Nome da organização"
          className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
          value={formData.name}
          onChange={(e) => {
            updateFormData({ name: e.target.value })
            if (errors?.name) {
              errors.name = null
            }
          }}
          error={errors?.name}
        />
      </motion.div>

      <motion.div className="space-y-2 p-1" variants={item}>
        <DynamicInput
          id="lineOfActivity"
          label="Atividade Principal"
          type="select"
          name="lineOfActivity"
          placeholder="Atividade principal"
          className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
          value={formData.lineOfActivity}
          onValueChange={(value) => {
            updateFormData({ lineOfActivity: value })
            if (errors?.lineOfActivity) {
              errors.lineOfActivity = null
            }
          }}
          options={organizationsTypes}
          error={errors?.lineOfActivity}
        />
      </motion.div>

      <motion.div className="space-y-2 p-1" variants={item}>
        <DynamicInput
          id="size"
          label="Tamanho da Organização"
          type="select"
          name="size"
          placeholder="Nome da organização"
          className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
          value={formData.size}
          onValueChange={(value) => {
            updateFormData({ size: value })
            if (errors?.size) {
              errors.size = null
            }
          }}
          options={organizationSize}
          error={errors?.size}
        />
      </motion.div>

      <motion.div className="space-y-2" variants={item}>
        <Label htmlFor="logo">Logo</Label>
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            {previewUrl ? (
              <>
                <Image
                  src={previewUrl || '/placeholder.svg'}
                  alt="Logo preview"
                  layout="fill"
                  objectFit="cover"
                />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                  type="button"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <Upload className="w-8 h-8" />
              </div>
            )}
          </div>
          <div>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              ref={fileInputRef}
            />
            {/* <DynamicInput
              type="button"
              name="logo"
              id="logo"
              ref={fileInputRef}
              label="Selecionar Logo"
              value={formData.logo ? 'Alterar Logo' : 'Selecionar Logo'}
              readOnly
              onClick={() => fileInputRef.current?.click()}
            /> */}

            <Label
              htmlFor="logo"
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
            >
              {formData.logo ? 'Alterar Logo' : 'Selecionar Logo'}
            </Label>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Carregue uma imagem quadrada, de preferência em formato PNG ou JPG.
          Tamanho máximo do arquivo: 5 MB.
        </p>
      </motion.div>
    </motion.div>
  )
}
