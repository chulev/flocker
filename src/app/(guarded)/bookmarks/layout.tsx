import { SidebarLayout } from '../_components/sidebar-layout'

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarLayout>
      <SidebarLayout.Content>{children}</SidebarLayout.Content>
    </SidebarLayout>
  )
}
