import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { routes } from "./routes"

const NoAuthRoute = () => {
    const { user } = useSelector(store => store.auth)
    const location = useLocation()

    return !user ? <Outlet /> : <Navigate to={location.state?.from?.pathname || routes.home.path} replace />
}

export default NoAuthRoute