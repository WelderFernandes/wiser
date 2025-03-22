'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import OrgInfoForm from './org-info-form'
import ContactInfoForm from './contact-info-form'
import ReviewForm from './review-form'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { createOrganization } from '@/app/dashboard/org/_action'
import { Organization } from '@prisma/client'
import { createSlug } from '@/utils/create-slug'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface FormErrors {
  name?: string
  lineOfActivity?: string
  size?: string
  logo?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  phone?: string
  website?: string
  adminName?: string
  adminEmail?: string
  adminPassword?: string
}

// Define the steps for the registration process
const steps = [
  { id: 'org', title: 'Informações basicas' },
  { id: 'contact', title: 'Contato' },
  { id: 'review', title: 'Revisão' },
]

// Define Zod schemas for validation
const orgInfoSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  lineOfActivity: z.string().min(1, 'Indústria é obrigatória'),
  size: z.string().min(1, 'Tamanho é obrigatório'),
  logo: z.instanceof(File).nullable(),
})

const contactInfoSchema = z.object({
  address: z.string().min(1, 'Endereço é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(1, 'Estado é obrigatório'),
  zipCode: z.string().min(1, 'Código postal é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
})

const adminUserSchema = z.object({
  adminName: z.string().min(1, 'Nome do administrador é obrigatório'),
  adminEmail: z.string().email('Email inválido'),
  adminPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export default function RegisterPage() {
  // const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right
  const [formData, setFormData] = useState({
    name: '',
    lineOfActivity: '',
    size: '',
    logo: null as File | null,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    website: '',
    ownerId: '',
    slug: '',
  })

  const router = useRouter()

  const [formErrors, setFormErrors] = useState({})

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    let schema
    const errors: FormErrors = {} // Use o tipo definido

    switch (currentStep) {
      case 0:
        schema = orgInfoSchema
        break
      case 1:
        schema = contactInfoSchema
        break
      case 2:
        schema = adminUserSchema
        break
      default:
        break
    }

    if (schema) {
      try {
        schema.parse(formData)
        setFormErrors({}) // Limpa os erros se a validação passar
        if (currentStep < steps.length - 1) {
          setDirection(1)
          setCurrentStep(currentStep + 1)
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Coleta os erros para o passo atual
          error.errors.forEach((err) => {
            errors[err.path[0] as keyof FormErrors] = err.message // Use o tipo definido
          })
          setFormErrors(errors) // Atualiza o estado com os erros coletados
        }
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    const organizationData = {
      name: formData.name,
      ownerId: formData.ownerId,
      slug: createSlug(formData.name),
      size: formData.size,
      lineOfActivity: formData.lineOfActivity,
      logoUrl: formData.logo ? URL.createObjectURL(formData.logo) : '',
    } as Organization
    console.log('🚀 ~ handleSubmit ~ organizationData:', organizationData)
    try {
      const newOrg = await createOrganization(organizationData)
      console.log('Organização criada:', newOrg)
      toast.success('Organização criada com sucesso!')
      router.push('/first-access/register/success')
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  }

  return (
    <div className="flex flex-1 items-center justify-center min-h-screen">
      <motion.div
        className="container max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg my-8">
          <CardHeader>
            <CardTitle>Cadastre a sua Organização</CardTitle>
            <CardDescription>
              Conclua as etapas a seguir para registrar sua organização.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className="flex flex-col items-center"
                    initial={false}
                    animate={
                      index <= currentStep ? { scale: 1.05 } : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        index < currentStep
                          ? 'bg-primary border-primary text-primary-foreground'
                          : index === currentStep
                            ? 'border-primary text-primary'
                            : 'border-muted text-muted-foreground'
                      }`}
                    >
                      {index < currentStep ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Check className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1 transition-colors duration-300 ${
                        index <= currentStep
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="relative mt-2">
                <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
                  <motion.div
                    className="h-1 bg-primary"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(currentStep / (steps.length - 1)) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Form steps */}
            <div className="py-4 overflow-hidden">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  {currentStep === 0 && (
                    <OrgInfoForm
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={formErrors}
                    />
                  )}
                  {currentStep === 1 && (
                    <ContactInfoForm
                      formData={formData}
                      updateFormData={updateFormData}
                      errors={formErrors}
                    />
                  )}

                  {currentStep === 2 && <ReviewForm formData={formData} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="transition-all duration-300 hover:translate-x-[-5px]"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="transition-all duration-300 hover:translate-x-[5px]"
              >
                Proximo
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="transition-all duration-300 hover:scale-105"
              >
                Criar Organização
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
