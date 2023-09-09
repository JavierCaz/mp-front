import React, { useEffect, useState } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import axios from 'axios'

const Pin = (props) => {
    /*----PROPS----*/
    const {
        openPin,
        onClosePin,
        snackBar,
        passwordId,
    } = props
    /*----STATE----*/
    const [pin, setPin] = useState('')
    const [pinError, setPinError] = useState(false)

    /*----FUNCTIONS----*/
    const validatePin = async () => {
        if (pin === '') return setPinError('Invalid entry')

        try {
            const response = await axios.get(`/api/passes/getPassword/${passwordId}`, {
                params: { pin }
            })

            if (response.data.valid) {
                onClosePin(response.data.pass)
            } else {
                setPinError(response.data.message)
            }
        } catch (error) {
            snackBar(error.message)
        }
    }

    /*----EFFECT----*/
    useEffect(() => {
        setPin('')
        setPinError('')
    }, [openPin])

    /*----RENDER----*/
    return (
        <Dialog open={openPin}>
            <DialogTitle>Enter PIN</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the PIN to show password.
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
                <Button variant="contained" color="action" onClick={() => onClosePin(false)}>Cancel</Button>
                <Button type="submit" variant="contained" onClick={validatePin}>Show</Button>
            </DialogActions>
        </Dialog>
    )
}

export default Pin
