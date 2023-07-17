import { useState, useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
// import { Snackbar, IconButton, Box, LinearProgress } from "@mui/material"
// import CloseIcon from '@mui/icons-material/Close';
import { register, reset } from "features/auth/authSlice"
import { useLoadingBarContext, useSnackBarContext } from "hooks"
import { Box, Button, TextField } from "@mui/material"
import { Person } from "@mui/icons-material"

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password2: '' })

    const [formErrors, setFormErrors] = useState({ name: false, email: false, password: false, password2: false })

    // const [open, setOpen] = useState(false);
    // const [snackMsg, setSnackMsg] = useState('');

    const { isLoading, isError, message } = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const { startProgress, stopProgress } = useLoadingBarContext()
    const snackBar = useSnackBarContext()

    const handleChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
        setFormErrors(prevState => ({ ...prevState, [e.target.name]: false }))
    }

    const validateForm = useCallback((formData = {}) => {
        const errors = {}
        let errorCount = 0

        Object.keys(formData).forEach(input => {
            if (formData[input] === '') {
                errors[input] = true
                errorCount++
            }
        })

        if (formData.password !== formData.password2) {
            errors.password2 = true
            errorCount++
            snackBar("Passwords do not match")
        }

        return { valid: errorCount === 0, errors }
    }, [snackBar])

    const handleSubmit = (e) => {
        e.preventDefault()

        // if (password !== password2) {
        //     // setOpen(true);
        //     // setSnackMsg("Passwords do not match")
        // } else {
        const formValidation = validateForm(formData)

        if (!formValidation.valid) {
            setFormErrors(formValidation.errors)
            return
        }

        const { name, email, password } = { ...formData }

        dispatch(register({ name, email, password }))
        // }
    }

    // const handleClose = (event, reason) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }

    //     setOpen(false);
    // };

    useEffect(() => {
        if (isError) {
            // setOpen(true);
            // setSnackMsg(message)
            snackBar(message)
        }

        dispatch(reset())

    }, [isError, message, dispatch, snackBar])

    useEffect(() => {
        isLoading ? startProgress() : stopProgress()
        return () => stopProgress()
        // eslint-disable-next-line
    }, [isLoading])

    // const action = (
    //     <>
    //         <IconButton
    //             size="small"
    //             aria-label="close"
    //             color="inherit"
    //             onClick={handleClose}
    //         >
    //             <CloseIcon fontSize="small" />
    //         </IconButton>
    //     </>
    // );

    // const loading = (
    //     <>
    //         <Box sx={{ width: '100%' }}>
    //             <LinearProgress />
    //         </Box>
    //     </>
    // )
    const { name, email, password, password2 } = formData

    return (
        <Box
            sx={{
                display: 'grid',
                gap: '1rem',
                justifyItems: 'center'
            }}
            component="form"
            onSubmit={handleSubmit}
        >
            {/* <>
                <section className="form"> */}
            {/* {isLoading ? loading : ''} */}

            {/* <form onSubmit={onSubmint}> */}
            
            <Person sx={{ fontSize: '5rem' }} color="action" />
            
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

            <TextField
                type="password"
                id="password"
                name="password"
                label="Password"
                value={password}
                placeholder="Enter your password"
                error={formErrors.password}
                helperText={formErrors.password ? "Incorrect entry" : ''}
                onChange={handleChange}
            />

            <TextField
                type="password"
                id="password2"
                name="password2"
                label="Confirm password"
                value={password2}
                placeholder="Confirm password"
                error={formErrors.password2}
                helperText={formErrors.password2 ? "Incorrect entry" : ''}
                onChange={handleChange}
            />

            {/* <button type="submit">Submit</button> */}
            <Button style={{ textTransform: 'none' }} variant="contained" type="submit">Sign Up</Button>

            {/* </form> */}

            {/* <div>
                    <Snackbar
                        open={open}
                        autoHideDuration={5000}
                        onClose={handleClose}
                        message={snackMsg}
                        action={action}
                    />
                </div> */}
            {/* </section>
            </> */}
        </Box>
    )
}

export default Register