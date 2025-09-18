import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'
import { UserProvider } from '../contexts/UserContext'

function RootComponent() {
  const location = useLocation()
  const isDashboard = location.pathname === '/creator/dashboard'

  return (
    <UserProvider>
      <div className="min-h-screen">
        {!isDashboard && <Header />}
        <main>
          <Outlet />
        </main>
        <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </div>
    </UserProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
