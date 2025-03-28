import { Separator } from '@radix-ui/react-separator'
import { SidebarTrigger } from './ui/sidebar'
import { SwipeTheme } from './swipe-theme'

export default function DashboardHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full justify-between px-4">
        <div className="flex items-center">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </div>
        <SwipeTheme />
      </div>
    </header>
  )
}
