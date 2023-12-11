import { useSelector, useDispatch, } from "react-redux"
import { logout, reset } from "features/auth/authSlice"
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"
import { authRoutes, noAuthRoutes, routes } from "routing/routes"
import { useCallback, useMemo, useContext } from "react"
import { Link, Box, IconButton } from "@mui/material"
import { Logout, Brightness7, Brightness4 } from "@mui/icons-material"
import { useTheme } from '@mui/material/styles';

const linkStyle = {
    display: 'grid',
    gridAutoFlow: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none'
}

const Header = (props) => {
    /*----PROPS----*/
    const {
        colorMode
    } = props

    const { user } = useSelector((state) => state.auth)
    const theme = useTheme();

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
            </Link>,
            <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
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
