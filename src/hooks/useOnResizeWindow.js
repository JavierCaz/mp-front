import { useEffect } from 'react'

const useOnResizeWindow = (onResize) => {
    useEffect(() => {
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [onResize])
}

export default useOnResizeWindow