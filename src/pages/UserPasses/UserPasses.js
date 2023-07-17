import React, { Fragment, useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import { useLoadingBarContext, useSnackBarContext } from 'hooks';

import { Grid, IconButton, TextField } from '@mui/material';
import UserPassItem from './UserPassItem';
import PassForm from './PassForm';
import { Add } from '@mui/icons-material';

const userPassesMock = [{
    "user": 1,
    "uri": "www.google.com",
    "password": "zmaod0gnu383445vyuf",
    "notes": "google notes",
    "name": "Google",
    "id": 1
},
{
    "user": 2,
    "uri": "https://www.facebook.com",
    "password": "zmaod0gnu383445vyuf",
    "notes": "facebook notes",
    "name": "Facebook",
    "id": 2
}]

const UserPasses = () => {
    /*----STATE----*/
    const [userPasses, setUserPasses] = useState([])
    const [filteredPasses, setFilteredPasses] = useState([])
    const [openForm, setOpenForm] = useState(false)
    const [passObject, setPassObject] = useState()

    /*----HOOKS----*/
    const { startProgress, stopProgress } = useLoadingBarContext()
    const snackBar = useSnackBarContext()

    /*----FUNCTIONS----*/
    const getUserPasses = useCallback(async () => {
        startProgress()
        try {
            const response = await axios.get('/api/passes')
            setUserPasses(response.data)
            setFilteredPasses(response.data)
        } catch (error) {
            if (error.code === 'ERR_NETWORK')
                snackBar('Error fetching user passwords. You are using mock object.')
            else
                snackBar(error.message)
            setUserPasses(userPassesMock)
        }
        stopProgress()
    }, [snackBar, startProgress, stopProgress])

    const openPassForm = useCallback((pass = undefined) => {
        setPassObject(pass)
        setOpenForm(true)
    }, [])

    const closePassForm = useCallback(() => {
        setOpenForm(false)
        setPassObject()
    }, [])

    const handleSave = useCallback((pass, actionType) => {
        if (actionType === 'PUT') {
            setUserPasses(userPasses => {
                userPasses.forEach((userPass, i) => {
                    if (userPass._id === pass._id) {
                        userPasses[i] = pass
                        return
                    }
                })
                return userPasses
            })
        } else if (actionType === 'POST') {
            setUserPasses(passwords => [...passwords, pass])
        }
    }, [])

    const deletePass = useCallback(async (passId) => {
        startProgress()
        if (window.confirm('Are you sure you want to delete this password?')) {
            try {
                await axios.delete(`/api/passes/${passId}`)
                getUserPasses()
            } catch (error) {
                snackBar(error.message)
            }
        }
        stopProgress()
    }, [getUserPasses, snackBar, startProgress, stopProgress])

    const searchChange = (e) => {
        let filter = e.target.value;

        filter ? setFilteredPasses(userPasses.filter(u => u.name.includes(filter))) : setFilteredPasses(userPasses);
    }

    /*----EFFECT----*/
    useEffect(() => {
        getUserPasses()
        // eslint-disable-next-line
    }, [])

    /*----RENDER----*/
    return (
        <Fragment>
            <IconButton size="large" color="lightgreen" sx={{ justifySelf: 'end' }} onClick={() => openPassForm()}>
                <Add fontSize="large" sx={{ color: '#00FF00' }} />
            </IconButton>
            <TextField id="standard-basic" label="Search" variant="standard" onChange={searchChange}/>
            <Grid container spacing={2}>
                {filteredPasses.map((pass, i) => (
                    <UserPassItem
                        key={i}
                        name={pass.name}
                        uri={pass.uri}
                        notes={pass.notes}
                        handleEdit={() => { openPassForm(pass) }}
                        handleDelete={() => { deletePass(pass._id) }}
                    />
                ))}
                <PassForm {...{
                    passObject,
                    openForm,
                    closePassForm,
                    onSave: handleSave,
                    snackBar,
                    startProgress,
                    stopProgress
                }} />
            </Grid>
        </Fragment>
    )
}

export default UserPasses
