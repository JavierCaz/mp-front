import LoadingBarContext from "context/LoadingBarContext"
import { useContext } from "react"

const useLoadingBarContext = () => useContext(LoadingBarContext)

export default useLoadingBarContext