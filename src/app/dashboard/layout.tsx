import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import DashboardHeader from '@/components/dashboard-header'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="container flex flex-1 flex-col gap-4 p-4 mx-auto w-full">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
