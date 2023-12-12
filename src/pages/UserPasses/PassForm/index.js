import React, { Fragment, useCallback, useEffect, useState } from 'react'
import axios from 'axios'

import { Box, Button, Card, Grid, IconButton, InputAdornment, Modal, TextField, FormControlLabel, Switch } from '@mui/material'
import { Visibility, VisibilityOff, ContentCopy } from '@mui/icons-material'
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
        passObject = { name: '', uri: '', username: '', password: '', notes: '', favorite: false },
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
    const [textPin, setTextPin] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    /*----FUNCTIONS----*/
    const validateForm = useCallback((formData = {}) => {
        const errors = {}
        let errorCount = 0
        const required = ['name', 'password'];

        Object.keys(formData).forEach(input => {
            if (required.includes(input) && formData[input] === '') {
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
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setFormData(formData => ({ ...formData, [e.target.id]: value }))
        setFormErrors(formErrors => ({ ...formErrors, [e.target.id]: false }))
    }, [])

    const pinValidation = async (callback, text) => {
        startProgress()

        try {
            const response = await axios.get(`/api/passes/getPassword/${formData._id}`)
            
            if (response.data.valid) {
                setFormData(formData => ({ ...formData, password: response.data.pass }))
                callback(response.data.pass);
            } else {
                setTextPin(text);
                setOpenPin(true)
            }
        } catch (error) {
            snackBar(error.message)
        }

        stopProgress()
    }

    const toggleShowPassword = () => {
        if (showPassword) {
            setShowPassword(false);
            stopProgress();
            return;
        }

        pinValidation(() => setShowPassword(true), 'show');
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
                            id="username"
                            name="username"
                            label="Username"
                            value={formData.username}
                            onChange={handleChange}
                            error={formErrors.username}
                            helperText={formErrors.username && 'Invalid entry'}
                            InputProps={{
                                endAdornment:
                                    <>
                                        {formData.hasOwnProperty('_id') &&
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => formData.username && navigator.clipboard.writeText(formData.username)}
                                                edge="end"
                                            >
                                                <ContentCopy />
                                            </IconButton>
                                        </InputAdornment>
                                        }
                                    </>,
                            }}
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
                                    <>
                                        {formData.hasOwnProperty('_id') &&
                                        <>
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={toggleShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => pinValidation((pass) => navigator.clipboard.writeText(pass), 'copy')}
                                                    edge="end"
                                                >
                                                    <ContentCopy />
                                                </IconButton>
                                            </InputAdornment>
                                        </>}
                                    </>,
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
                        <FormControlLabel
                            value={formData.favorite}
                            control={
                                <Switch 
                                    id="favorite"
                                    name="favorite"
                                    checked={formData.favorite} 
                                    onChange={handleChange} 
                                    color="primary" 
                                />
                            }
                            label="Favorite"
                            labelPlacement="end"
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
                textPin,
                onClosePin,
                snackBar,
                passwordId: formData._id
            }} />
        </Fragment>
    )
}

export default PassForm
