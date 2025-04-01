'use client'
import Calendar from '@/components/calendar/calendar'
import EnhancedBreadcrumb, {
  BreadcrumbItemType,
} from '@/components/ModernBreadcrumb'
import { Calendar1Icon, Home } from 'lucide-react'

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
      icon: Calendar1Icon,
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
      {/* <Calendario /> */}
      <Calendar />
    </>
  )
}
