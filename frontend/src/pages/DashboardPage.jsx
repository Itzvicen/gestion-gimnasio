import Dashboard from "../components/Dashboard"
import SideBar from "../components/SideBar"

const DashboardPage = () => {
  return (
  <div className="flex bg-white dark:bg-gray-800">
    <SideBar />
    <Dashboard />
  </div>
  )
}

export default DashboardPage;