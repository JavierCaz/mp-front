import React, { Fragment, useCallback, useEffect, useState } from 'react'
import axios from 'axios'

import { Box, Button, Card, Grid, IconButton, InputAdornment, Modal, TextField } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import Pin from './Pin'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'grid',
    gap: 2,
    width: { xs: '95%', md: 400 },
    maxWidth: '100%',
    borderRadius: 2,
    boxShadow: 24,
    pt: 4,
    pb: 2,
    px: 2,
    boxSizing: 'border-box',
    outline: 'none',
}

const initFormErrors = { name: false, uri: false, password: false, notes: false }

const PassForm = (props) => {
    /*----PROPS----*/
    const {
        passObject = { name: '', uri: '', password: '', notes: '' },
        openForm,
        closePassForm,
        onSave,
        snackBar,
        startProgress,
        stopProgress
    } = props

    /*----STATE----*/
    const [formData, setFormData] = useState(passObject)
    const [formErrors, setFormErrors] = useState(initFormErrors)
    const [openPin, setOpenPin] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    /*----FUNCTIONS----*/
    const validateForm = useCallback((formData = {}) => {
        const errors = {}
        let errorCount = 0
        Object.keys(formData).forEach(input => {
            if (input !== 'notes' && formData[input] === '') {
                errors[input] = true
                errorCount++
            }
        })
        return { valid: errorCount === 0, errors }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formValidation = validateForm(formData)

        if (!formValidation.valid) {
            setFormErrors(formValidation.errors)
            return
        }

        startProgress()

        try {
            const actionType = formData.hasOwnProperty('_id') ? 'PUT' : 'POST'
            let response = {}
            if (actionType === 'PUT') {
                response = await axios.put(`/api/passes/${formData._id}`, formData)
            } else {
                response = await axios.post('/api/passes', {
                    user: 1,
                    ...formData
                })
            }
            onSave(response.data, actionType)
            closePassForm()
        } catch (error) {
            snackBar(error.message)
        }
        stopProgress()
    }

    const handleChange = useCallback(e => {
        setFormData(formData => ({ ...formData, [e.target.id]: e.target.value }))
        setFormErrors(formErrors => ({ ...formErrors, [e.target.id]: false }))
    }, [])

    const toggleShowPassword = async () => {
        startProgress()
        try {
            const response = await axios.get(`/api/passes/getPassword/${formData._id}`)

            if (response.data.valid) {
                setShowPassword(true)
                setFormData(formData => ({ ...formData, password: response.data.pass }))
            } else {
                setOpenPin(true)
            }
        } catch (error) {
            snackBar(error.message)
        }
        stopProgress()
    }

    const onClosePin = useCallback((password = '') => {
        setOpenPin(false)
        if (password) {
            setShowPassword(true)
            setFormData(formData => ({ ...formData, password }))
        }
    }, [])

    /*----RENDER----*/
    useEffect(() => {
        setFormData(passObject)
        setShowPassword(!passObject.hasOwnProperty('_id'))
        setFormErrors(initFormErrors)
        // eslint-disable-next-line
    }, [openForm])

    /*----RENDER----*/
    return (
        <Fragment>
            <Modal
                open={openForm}
                onClose={closePassForm}
            >
                <Box component="form" autoComplete="false" onSubmit={handleSubmit}>
                    <Card sx={style}>
                        <TextField
                            id="name"
                            name="name"
                            label="Name"
                            value={formData.name}
                            onChange={handleChange}
                            error={formErrors.name}
                            helperText={formErrors.name && 'Invalid entry'}
                        />
                        <TextField
                            type="url"
                            id="uri"
                            name="uri"
                            label="Uri"
                            value={formData.uri}
                            onChange={handleChange}
                            error={formErrors.uri}
                            helperText={formErrors.uri && 'Invalid entry'}
                        />
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            label="Password"
                            value={formData.password}
                            onChange={handleChange}
                            error={formErrors.password}
                            helperText={formErrors.password && 'Invalid entry'}
                            disabled={!showPassword}
                            InputProps={{
                                endAdornment:
                                    <>{
                                        formData.hasOwnProperty('_id') && !showPassword &&
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={toggleShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }</>,
                            }}
                        />
                        <TextField
                            multiline
                            rows="3"
                            id="notes"
                            name="notes"
                            label="Notes"
                            value={formData.notes}
                            onChange={handleChange}
                            error={formErrors.notes}
                            helperText={formErrors.notes && 'Invalid entry'}
                        />
                        <Grid container spacing={2} justifyContent="flex-end">
                            <Grid item>
                                <Button variant="contained" color="action" onClick={closePassForm}>Cancel</Button>
                            </Grid>
                            <Grid item>
                                <Button type="submit" variant="contained">Save</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Box>
            </Modal>
            <Pin {...{
                openPin,
                onClosePin,
                snackBar,
                passwordId: formData._id
            }} />
        </Fragment>
    )
}

export default PassForm
