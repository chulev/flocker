import { SidebarLayout } from '../_components/sidebar-layout'
import { Trending } from '../_components/trending'

export default function HashtagLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarLayout>
      <SidebarLayout.Sidebar>
        <Trending />
      </SidebarLayout.Sidebar>
      <SidebarLayout.Content>{children}</SidebarLayout.Content>
    </SidebarLayout>
  )
}
