import React, { useState } from 'react'
import { ChevronRight, ChevronDown, MoreHorizontal } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent } from './ui/card'

export interface BreadcrumbItemType {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  description?: string
  children?: BreadcrumbItemType[]
  isCollapsed?: boolean
}

const EnhancedBreadcrumb = ({
  items = [] as BreadcrumbItemType[],
  maxItems = 4,
  variant = 'default', // default, minimal, expanded
}: {
  items: BreadcrumbItemType[]
  maxItems?: number
  variant?: 'default' | 'minimal' | 'expanded'
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Estilos baseados na variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return 'bg-transparent'
      case 'expanded':
        return ' px-6 py-3 rounded-lg'
      default:
        return 'bg-white dark:bg-slate-900 px-4 py-2 rounded-md shadow-sm'
    }
  }

  // Determina quais itens mostrar em telas pequenas
  const visibleItems = () => {
    if (items.length <= maxItems) return items

    // Sempre mostrar o primeiro, o último e o penúltimo
    const firstItem = items[0]
    const lastItem = items[items.length - 1]
    const priorToLastItem = items[items.length - 2]

    if (maxItems === 3) {
      return [firstItem, { label: '...', isCollapsed: true }, lastItem]
    }

    if (maxItems === 4) {
      return [
        firstItem,
        { label: '...', isCollapsed: true },
        priorToLastItem,
        lastItem,
      ]
    }

    // Para maxItems >= 5, mostrar alguns do meio também
    const middleItems = items.slice(1, items.length - 2)
    const collapsedItems =
      middleItems.length > maxItems - 3
        ? [
            ...middleItems.slice(0, 1),
            { label: '...', isCollapsed: true, items: middleItems.slice(1), description: undefined },
            ...middleItems.slice(-1),
          ]
        : middleItems

    return [firstItem, ...collapsedItems, priorToLastItem, lastItem]
  }

  return (
    <TooltipProvider>
      <Card
        className={`w-full mx-auto transition-all duration-200 ${getVariantStyles()}`}
        role="navigation"
        aria-label="Navegação estrutural"
      >
        <Breadcrumb>
            <BreadcrumbList>
              {visibleItems().map((item, index) => {
                const isLastItem = index === visibleItems().length - 1
                const isCollapsedMenu = item.isCollapsed

                // Renderização do item colapsado
                if (isCollapsedMenu) {
                  return (
                    <BreadcrumbItem key={`collapsed-${index}`}>
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center">
                          {'items' in item &&
                            item.items &&
                            item.items.map((subItem, subIndex) => (
                              <DropdownMenuItem key={subIndex}>
                                <BreadcrumbLink
                                  href={subItem.href}
                                  className="w-full text-sm"
                                >
                                  {subItem.label}
                                </BreadcrumbLink>
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </BreadcrumbItem>
                  )
                }

                // Renderização do último item (página atual)
                if (isLastItem) {
                  return (
                    <BreadcrumbItem key={index}>
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                      <BreadcrumbPage className="font-medium">
                        {item.label}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  )
                }

                // Renderização dos links normais
                return (
                  <BreadcrumbItem key={index}>
                    {index > 0 && (
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <BreadcrumbLink
                          href={'href' in item ? item.href : undefined}
                          className={`flex items-center transition-all duration-200 ${
                            hoveredIndex === index
                              ? 'text-primary font-medium'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          aria-label={`Navegar para ${item.label}`}
                        >
                          {index === 0 && 'icon' in item && item.icon && (
                            <item.icon className="mr-1 h-4 w-4" />
                          )}
                          <span>{item.label}</span>
                          {'children' in item && item.children && (
                            <ChevronDown className="ml-1 h-3 w-3" />
                          )}
                        </BreadcrumbLink>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        {item.description || `Ir para ${item.label}`}
                      </TooltipContent>
                    </Tooltip>

                    {/* Dropdown para itens com filhos */}
                    {'children' in item && item.children && (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="sr-only">
                          Abrir submenu de {item.label}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {item.children.map((child, childIndex) => (
                            <DropdownMenuItem key={childIndex}>
                              <BreadcrumbLink
                                href={child.href}
                                className="w-full text-sm"
                              >
                                {child.label}
                              </BreadcrumbLink>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </BreadcrumbItem>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
      </Card>
    </TooltipProvider>
  )
}
export default EnhancedBreadcrumb
