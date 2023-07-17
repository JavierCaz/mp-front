import { useState, useEffect, useCallback } from "react"
import { login, reset } from "features/auth/authSlice"
import { useSelector, useDispatch } from "react-redux"
// import { Snackbar, IconButton, LinearProgress } from "@mui/material"
import { Box, Button, TextField } from "@mui/material"
// import CloseIcon from '@mui/icons-material/Close';
import { useLoadingBarContext, useSnackBarContext } from "hooks";
import { Person } from "@mui/icons-material";

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' })

    const [formErrors, setFormErrors] = useState({ email: false, password: false })

    // const [open, setOpen] = useState(false);
    // const [snackMsg, setSnackMsg] = useState('');

    const { startProgress, stopProgress } = useLoadingBarContext()
    const snackBar = useSnackBarContext()

    const dispatch = useDispatch()

    const { isLoading, isError, message } = useSelector((state) => state.auth)

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
        return { valid: errorCount === 0, errors }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        const formValidation = validateForm(formData)

        if (!formValidation.valid) {
            setFormErrors(formValidation.errors)
            return
        }

        dispatch(login(formData))
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
    //         size="small"
    //         aria-label="close"
    //         color="inherit"
    //         onClick={handleClose}
    //         >
    //             <CloseIcon fontSize="small" />
    //         </IconButton>
    //     </>
    //   );

    // const loading = (
    //     <>
    //         <Box sx={{ width: '100%' }}>
    //             <LinearProgress />
    //         </Box>
    //     </>
    //   )

    const { email, password } = formData

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
            {/* {isLoading ? loading : ''} */}

            {/* <form onSubmit={onSubmint}> */}
            
            <Person sx={{ fontSize: '5rem' }} color="action" />

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

            <Button style={{ textTransform: 'none' }} variant="contained" type="submit">Sign In</Button>

            {/* <button type="submit">Submit</button> */}
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
        </Box>
    )
}

export default Login