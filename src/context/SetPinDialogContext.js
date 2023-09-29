import { createContext, useEffect, useState } from "react"
import axios from 'axios'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { useSnackBarContext } from 'hooks'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from "features/auth/authSlice"

const initialState = {
    mustSetPin: false,
    openSetPinDialog: () => { }
}

const SetPinDialogContext = createContext(initialState)

export const SetPinDialogContextProvider = ({ children }) => {

    /*----PROPS----*/

    /*----STATE----*/
    const { user } = useSelector(store => store.auth)
    const [isOpen, setIsOpen] = useState(false)
    const [pin, setPin] = useState('')
    const [pinError, setPinError] = useState(false)

    /*----HOOKS----*/
    const dispatch = useDispatch()
    const snackBar = useSnackBarContext()

    /*----FUNCTIONS----*/
    const savePin = async () => {
        if (pin === '') return setPinError('Invalid entry')

        try {
            const response = await axios.put('/api/users/set_pin', { pin })
            response.data.message && snackBar(response.data.message)
            setIsOpen(false)
            dispatch(updateUser({ mustSetPin: false }))
        } catch (error) {
            snackBar(error.message)
        }
    }

    /*----EFFECT----*/
    useEffect(() => {
        if (user?.mustSetPin)
            setIsOpen(true)
    }, [user?.mustSetPin])

    useEffect(() => {
        setPin('')
        setPinError('')
    }, [isOpen])

    return (
        <SetPinDialogContext.Provider value={{ mustSetPin: user?.mustSetPin, openSetPinDialog: () => setIsOpen(true) }}>
            {children}
            {user &&
                <Dialog open={isOpen}>
                    <DialogTitle>Set your PIN</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter a PIN to be able to store and show passwords.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            fullWidth
                            type="password"
                            autoComplete="nope"
                            margin="dense"
                            id="pin"
                            name="pin"
                            label="PIN"
                            value={pin}
                            onChange={e => setPin(e.target.value)}
                            error={pinError !== ''}
                            helperText={pinError}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="action" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" onClick={savePin}>Save</Button>
                    </DialogActions>
                </Dialog>
            }
        </SetPinDialogContext.Provider>
    )
}

export default SetPinDialogContext