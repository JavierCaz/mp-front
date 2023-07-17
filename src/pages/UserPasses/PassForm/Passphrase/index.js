import React, { useEffect, useState } from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'

const Passphrase = (props) => {
    /*----PROPS----*/
    const {
        openPassphrase,
        onClosePassphrase,
    } = props
    /*----STATE----*/
    const [passphrase, setPassphrase] = useState('')
    const [passphraseError, setPassphraseError] = useState(false)

    /*----FUNCTIONS----*/
    const validatePassphrase = () => {
        if (passphrase === '') return setPassphraseError(true)
        onClosePassphrase(true)
    }

    /*----EFFECT----*/
    useEffect(() => {
        setPassphrase('')
        setPassphraseError(false)
    }, [openPassphrase])

    /*----RENDER----*/
    return (
        <Dialog open={openPassphrase} onClose={() => onClosePassphrase(false)}>
            <DialogTitle>Passphrase</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the passphrase to show password.
                </DialogContentText>
                <TextField
                    autoFocus
                    fullWidth
                    margin="dense"
                    id="passphrase"
                    name="passphrase"
                    label="Passphrase"
                    value={passphrase}
                    onChange={e => setPassphrase(e.target.value)}
                    error={passphraseError}
                    helperText={passphraseError && 'Invalid entry'}
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
