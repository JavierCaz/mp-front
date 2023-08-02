import React, { useEffect, useState } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import axios from 'axios'

const Passphrase = (props) => {
    /*----PROPS----*/
    const {
        openPassphrase,
        onClosePassphrase,
        snackBar,
        passwordId,
    } = props
    /*----STATE----*/
    const [passphrase, setPassphrase] = useState('')
    const [passphraseError, setPassphraseError] = useState(false)

    /*----FUNCTIONS----*/
    const validatePassphrase = async () => {
        if (passphrase === '') return setPassphraseError('Invalid entry')

        try {
            const response = await axios.get(`/api/passes/${passwordId}`, {
                params: { pin: passphrase }
            })

            if (response.data.valid) {
                onClosePassphrase(response.data.pass)
            } else {
                setPassphraseError(response.data.message)
            }
        } catch (error) {
            snackBar(error.message)
        }
    }

    /*----EFFECT----*/
    useEffect(() => {
        setPassphrase('')
        setPassphraseError('')
    }, [openPassphrase])

    /*----RENDER----*/
    return (
        <Dialog open={openPassphrase}>
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
                    value={passphrase}
                    onChange={e => setPassphrase(e.target.value)}
                    error={passphraseError !== ''}
                    helperText={passphraseError}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="action" onClick={() => onClosePassphrase(false)}>Cancel</Button>
                <Button type="submit" variant="contained" onClick={validatePassphrase}>Show</Button>
            </DialogActions>
        </Dialog>
    )
}

export default Passphrase
