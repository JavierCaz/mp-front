import SnackBarContext from "context/SnackBarContext"
import { useContext } from "react"

const useSnackBarContext = () => useContext(SnackBarContext)

export default useSnackBarContext