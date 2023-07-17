import { Box, LinearProgress } from "@mui/material"
import { createContext, useCallback, useState } from "react"

const initialState = {
    startProgress: () => { },
    stopProgress: () => { },
}

const LoadingBarContext = createContext(initialState)

export const LoadingBarContextProvider = ({ children }) => {

    const [isLoading, setIsLoading] = useState(false)

    const startProgress = useCallback(() => {
        setIsLoading(true)
    }, [])

    const stopProgress = useCallback(() => {
        setIsLoading(false)
    }, [])

    return (
        <LoadingBarContext.Provider value={{ startProgress, stopProgress }} >
            {isLoading &&
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            }
            {children}
        </LoadingBarContext.Provider>
    )
}

export default LoadingBarContext