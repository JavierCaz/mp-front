import { useContext } from 'react'
import ScreenSizeContext from "context/ScreenSizeContext"

const useScreenSizeContext = () => useContext(ScreenSizeContext)

export default useScreenSizeContext