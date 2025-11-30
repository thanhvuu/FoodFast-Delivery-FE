import { useMemo, useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Topbar from './components/Topbar/Topbar'
import Dashboard from './pages/Dashboard/Dashboard'
import Users from './pages/Users/Users'
import Restaurants from './pages/Restaurants/Restaurants'
import Orders from './pages/Orders/Orders'
import Operations from './pages/Operations/Operations'
import Tracking from './pages/Tracking/Tracking'
import './App.css'

const viewComponents = {
  dashboard: Dashboard,
  users: Users,
  restaurants: Restaurants,
  orders: Orders,
  operations: Operations,
  tracking: Tracking,
}

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const ActiveComponent = useMemo(() => viewComponents[activeView] ?? Dashboard, [activeView])

  return (
    <div className="superadmin-app">
      <Sidebar activeView={activeView} onSelect={setActiveView} />
      <div className="sa-main">
        <Topbar />
        <main className="sa-content">
          <ActiveComponent />
        </main>
      </div>
    </div>
  )
}

export default App
