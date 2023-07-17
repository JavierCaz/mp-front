import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { routes } from "./routes"

const AuthRoute = () => {
    const { user } = useSelector(store => store.auth)
    const location = useLocation()
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return user ? <Outlet /> : <Navigate replace to={routes.login.path} state={{ from: location }} />
}

export default AuthRoute