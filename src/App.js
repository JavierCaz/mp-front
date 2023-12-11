import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useComposeProviders } from 'hooks'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ScreenSizeContextProvider } from 'context/ScreenSizeContext'
import { LoadingBarContextProvider } from 'context/LoadingBarContext'
import { authRoutes, noAuthRoutes, routes } from 'routing/routes'
import Layout from 'components/Layout'
import AuthRoute from 'routing/AuthRoute'
import NoAuthRoute from 'routing/NoAuthRoute'
import { SnackBarContextProvider } from 'context/SnackBarContext'
import React from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import { SetPinDialogContextProvider } from 'context/SetPinDialogContext';

const App = () => {
  const RouterProviders = useComposeProviders(Router, Routes)
  const AppProviders = useComposeProviders(ScreenSizeContextProvider, LoadingBarContextProvider, SnackBarContextProvider, SetPinDialogContextProvider)
  const AuthRouteProviders = useComposeProviders(AuthRoute)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [mode, setMode] = React.useState(prefersDarkMode ? 'dark' : 'light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProviders>
        <RouterProviders>
          <Route exact path='/' element={<Layout colorMode={colorMode} />}>
            {/* Protected routes, accessible with authentication */}
            <Route element={<AuthRouteProviders />}>
              {authRoutes.map(routeName =>
                <Route key={routeName} path={routes[routeName].path} element={routes[routeName].element} />
              )}
            </Route>
            {/* Unprotected routes, accessible if not exists authentication */}
            <Route element={<NoAuthRoute />}>
              {noAuthRoutes.map(routeName =>
                <Route key={routeName} path={routes[routeName].path} element={routes[routeName].element} />
              )}
            </Route>
          </Route>
          {/* Not existing routes */}
          <Route path="*" element={<Navigate to={routes.home.path} replace />} />
        </RouterProviders>
      </AppProviders>
    </ThemeProvider>
  )
}

export default App
