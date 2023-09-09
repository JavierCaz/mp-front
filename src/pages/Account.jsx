import { useState, useEffect, useCallback, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { reset } from "features/auth/authSlice"
import { useLoadingBarContext, useSnackBarContext } from "hooks"
import { Box, Button, TextField, InputAdornment, IconButton } from "@mui/material"
import { Person } from "@mui/icons-material"
import axios from 'axios';

const Account = () => {
    const [formData, setFormData] = useState({ name: '', email: ''})
    const [formErrors, setFormErrors] = useState({ name: false, email: false })

    const { isLoading, isError, message } = useSelector((state) => state.auth)
    
    const userIdRef = useRef('');

    const dispatch = useDispatch()
    const { startProgress, stopProgress } = useLoadingBarContext()
    const snackBar = useSnackBarContext()

    /*----FUNCTIONS----*/
    const getMe = useCallback(async () => {
        startProgress()
        try {
            const response = await axios.get('/api/users/me')
            setFormData({ name: response.data.name, email: response.data.email })
            userIdRef.current = response.data._id
        } catch (error) {
            snackBar(error.message)
        }
        stopProgress()
    }, [snackBar, startProgress, stopProgress])

    const handleChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
        setFormErrors(prevState => ({ ...prevState, [e.target.name]: false }))
    }

    const validateForm = useCallback((formData = {}) => {
        const errors = {}
        let errorCount = 0

        if (!formData.name) {
            errors.name = true
            errorCount++
            snackBar("Name empty")
        }

        if (!formData.email) {
            errors.email = true
            errorCount++
            snackBar("Email empty")
        }

        return { valid: errorCount === 0, errors }
    }, [snackBar])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formValidation = validateForm(formData)

        if (!formValidation.valid) {
            setFormErrors(formValidation.errors)
            return
        }
        try {
            await axios.put(`/api/users/${userIdRef.current}`, formData)
            snackBar("Updated")
        } catch (error) {
            snackBar(error.message)
        }
        getMe()
    }

    /*----EFFECT----*/
    useEffect(() => {
        getMe()
    }, [])

    useEffect(() => {
        if (isError) {
            snackBar(message)
        }

        dispatch(reset())

    }, [isError, message, dispatch, snackBar])

    useEffect(() => {
        isLoading ? startProgress() : stopProgress()
        return () => stopProgress()
    }, [isLoading])

    const { name, email } = formData

    return (
        <>
            <Box
                sx={{
                    display: 'grid',
                    gap: '1rem',
                    justifyItems: 'center'
                }}
                component="form"
                onSubmit={handleSubmit}
            >
                <Person sx={{ fontSize: '3rem' }} color="action" />
                
                <TextField
                    type="text"
                    id="name"
                    name="name"
                    label="Name"
                    value={name}
                    placeholder="Enter your name"
                    error={formErrors.name}
                    helperText={formErrors.name ? "Incorrect entry" : ''}
                    onChange={handleChange}
                />

                <TextField
                    type="email"
                    id="email"
                    name="email"
                    label="Email"
                    value={email}
                    placeholder="Enter your email"
                    error={formErrors.email}
                    helperText={formErrors.email ? "Incorrect entry" : ''}
                    onChange={handleChange}
                />

                <Button style={{ textTransform: 'none' }} variant="contained" type="submit">Update</Button>
            </Box>
        </>
    )
}

export default Account