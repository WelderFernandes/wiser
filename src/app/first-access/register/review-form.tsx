/* eslint-disable react/no-unescaped-entities */
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface ReviewFormProps {
  formData: {
    // Organization info
    name: string
    lineOfActivity: string
    size: string
    logo: File | null

    // Contact info
    address: string
    city: string
    state: string
    zipCode: string
    phone: string
    website: string
  }
}

export default function ReviewForm({ formData }: ReviewFormProps) {
  // Helper function to format lineofactivity and size values
  const formatValue = (key: string, value: string) => {
    if (key === 'branchaAtivity') {
      const industries: Record<string, string> = {
        technology: 'Technology',
        healthcare: 'Healthcare',
        education: 'Education',
        finance: 'Finance',
        retail: 'Retail',
        manufacturing: 'Manufacturing',
        other: 'Other',
      }
      return industries[value] || value
    }

    if (key === 'size') {
      const sizes: Record<string, string> = {
        '1-10': '1-10 employees',
        '11-50': '11-50 employees',
        '51-200': '51-200 employees',
        '201-500': '201-500 employees',
        '501-1000': '501-1000 employees',
        '1000+': '1000+ employees',
      }
      return sizes[value] || value
    }

    return value
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
      className="space-y-6"
      variants={staggerItems}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <h3 className="text-lg font-medium">Informações basicas</h3>
        <motion.div
          className="mt-3 border rounded-md divide-y overflow-hidden"
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-2 p-3">
            <span className="text-muted-foreground">Nome da Organização</span>
            <span>{formData.name}</span>
          </div>
          <div className="grid grid-cols-2 p-3">
            <span className="text-muted-foreground">Ramo de Actividade</span>
            <span>
              {formatValue('lineofactivity', formData.lineOfActivity)}
            </span>
          </div>
          <div className="grid grid-cols-2 p-3">
            <span className="text-muted-foreground">
              Quantidade de Colaboradores
            </span>
            <span>{formatValue('size', formData.size)}</span>
          </div>
          <div className="grid grid-cols-2 p-3">
            <span className="text-muted-foreground">Logo</span>
            <div className="relative w-16 h-16 border rounded-md overflow-hidden">
              {formData.logo ? (
                <Image
                  src={URL.createObjectURL(formData.logo) || '/placeholder.svg'}
                  alt="Organization logo"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <span className="text-sm text-muted-foreground">
                  Nenhuma imagem selecionada
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={item}>
        <h3 className="text-lg font-medium">Informações de Contato</h3>
        <motion.div
          className="mt-3 border rounded-md divide-y overflow-hidden"
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-2 p-3">
            <span className="text-muted-foreground">Rua</span>
            <span>{formData.address}</span>
          </div>
          <div className="grid grid-cols-2 p-3">
            <span className="text-muted-foreground">Cidade</span>
            <span>{formData.city}</span>
          </div>
          <div className="grid grid-cols-2 p-3">
            <span className="text-muted-foreground">Estado</span>
            <span>{formData.state}</span>
          </div>
          <div className="grid grid-cols-2 p-3">
            <span className="text-muted-foreground">CEP</span>
            <span>{formData.zipCode}</span>
          </div>
          <div className="grid grid-cols-2 p-3">
            <span className="text-muted-foreground">Telefone</span>
            <span>{formData.phone}</span>
          </div>
          <div className="grid grid-cols-2 p-3">
            <span className="text-muted-foreground">Website</span>
            <span>{formData.website || 'N/A'}</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="p-4 bg-muted rounded-md"
        variants={item}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-sm">
          Por favor, revise as informações acima antes de concluir seu registro.
          Ao clicar em "Concluir Cadastro", você concorda com nossos Termos de
          Serviço e Política de Privacidade.
        </p>
      </motion.div>
    </motion.div>
  )
}
