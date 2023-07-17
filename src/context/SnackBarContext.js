import { IconButton, Snackbar } from "@mui/material"
import { createContext, useCallback, useMemo, useState } from "react"
import CloseIcon from '@mui/icons-material/Close';

const initialState = {
    showSnack: () => { }
}

const SnackBarContext = createContext(initialState)

export const SnackBarContextProvider = ({ children }) => {

    const [isOpen, setIsOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const showSnack = useCallback((msg) => {
        setIsOpen(true)
        setErrorMsg(msg)
    }, [])

    const handleClose = useCallback((event, reason) => {
        if (reason === 'clickaway') return

        setIsOpen(false)
    }, [])

    const snackBarAction = useMemo(() => {
        return (
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        )
    }, [handleClose])

    return (
        <SnackBarContext.Provider value={showSnack}>
            {children}
            <Snackbar
                open={isOpen}
                autoHideDuration={5000}
                onClose={handleClose}
                message={errorMsg}
                action={snackBarAction}
            />
        </SnackBarContext.Provider>
    )
}

export default SnackBarContext