import { useSelector, useDispatch } from "react-redux"
import { logout, reset } from "features/auth/authSlice"
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"
import { authRoutes, noAuthRoutes, routes } from "routing/routes"
import { useCallback, useMemo } from "react"
import { Link } from "@mui/material"
import { Logout } from "@mui/icons-material"

const linkStyle = {
    display: 'grid',
    gridAutoFlow: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none'
}

const Header = () => {
    const { user } = useSelector((state) => state.auth)

    const { pathname } = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onLogout = useCallback(() => {
        dispatch(logout())
        dispatch(reset())
        navigate('/')
    }, [dispatch, navigate])

    const navLinks = useMemo(() => {
        if (user) {
            return [...authRoutes.map(routeName =>
                routes[routeName].path !== pathname &&
                <RouterLink key={routes[routeName].name} className="css-1ps4owl-MuiTypography-root-MuiLink-root"
                    to={routes[routeName].path}
                    style={linkStyle}>
                    {routes[routeName].name}
                    {routes[routeName].icon}
                </RouterLink>
            ),
            <Link key='logout' style={{ textTransform: 'none', cursor: 'pointer', ...linkStyle }} onClick={onLogout}>
                Logout
                <Logout />
            </Link>
            ]
        }

        return noAuthRoutes.map(routeName =>
            routes[routeName].path !== pathname &&
            <RouterLink key={routes[routeName].name} className="css-1ps4owl-MuiTypography-root-MuiLink-root"
                to={routes[routeName].path} style={linkStyle}>
                {routes[routeName].name}
                {routes[routeName].icon}
            </RouterLink>
        )
    }, [pathname, user, onLogout])

    return (
        <header>
            <nav style={{ display: 'grid', gridAutoFlow: 'column', gap: '1em', alignItems: 'center', justifyContent: 'end', padding: '0.5em' }}>
                {navLinks}
            </nav>
        </header>
    )
}

export default Header
