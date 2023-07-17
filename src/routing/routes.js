import { AppRegistration, Home as HomeIcon, Login as LoginIcon } from '@mui/icons-material'

import { Home, Login, Register } from 'pages'

export const authRoutes = ['home'] //Redirect to login if user is not authenticated
export const noAuthRoutes = ['login', 'signup'] //Redirect to home if user is authenticated

export const routes = {
    home: {
        name: 'Home',
        path: '/',
        element: <Home />,
        icon: <HomeIcon fontSize="large" />
    },
    login: {
        name: 'Login',
        path: '/login',
        element: <Login />,
        icon: <LoginIcon fontSize="large" />
    },
    signup: {
        name: 'Register',
        path: '/register',
        element: <Register />,
        icon: <AppRegistration fontSize="large" />
    }
}

export const pages = [
    {
        name: 'Home',
        path: '/',
        element: <Home />
    },
    {
        name: 'Login',
        path: '/login',
        element: <Login />
    },
    {
        name: 'Register',
        path: '/register',
        element: <Register />
    },
]