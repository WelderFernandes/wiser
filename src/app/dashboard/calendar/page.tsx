'use client'
import Calendario from '@/components/calandar'
import EnhancedBreadcrumb, {
  BreadcrumbItemType,
} from '@/components/ModernBreadcrumb'
import { Calendar, Home } from 'lucide-react'

export default function Page() {
  const navigationItems: BreadcrumbItemType[] = [
    {
      label: 'Home',
      href: '/dashboard',
      icon: Home,
      description: 'Voltar para a página inicial',
    },
    {
      label: 'Agenda',
      href: '/shedule',
      icon: Calendar,
      description: 'Ver todos os produtos',
    },
  ]
  return (
    <>
      <EnhancedBreadcrumb
        items={navigationItems}
        variant="expanded"
        maxItems={5}
      />
      <Calendario />
    </>
  )
}
