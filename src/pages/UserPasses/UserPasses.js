import React, { Fragment, useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import { useLoadingBarContext, useSetPinDialogContext, useSnackBarContext } from 'hooks';

import { Grid, IconButton, TextField } from '@mui/material';
import UserPassItem from './UserPassItem';
import PassForm from './PassForm';
import { Add } from '@mui/icons-material';

const UserPasses = () => {
    /*----STATE----*/
    const [userPasses, setUserPasses] = useState([])
    const [searchValue, setSearchValue] = useState('');
    const [openForm, setOpenForm] = useState(false)
    const [passObject, setPassObject] = useState()

    /*----HOOKS----*/
    const { startProgress, stopProgress } = useLoadingBarContext()
    const snackBar = useSnackBarContext()
    const { mustSetPin, openSetPinDialog } = useSetPinDialogContext()

    /*----FUNCTIONS----*/
    const getUserPasses = useCallback(async () => {
        startProgress()
        try {
            const response = await axios.get('/api/passes')
            setUserPasses(sortByFavoritesAlphabetically(response.data))
        } catch (error) {
            if (error.code === 'ERR_NETWORK')
                snackBar('Error fetching user passwords. You are using mock object.')
            else
                snackBar(error.message)
        }
        stopProgress()
    }, [snackBar, startProgress, stopProgress])

    const sortByFavoritesAlphabetically = (array) => {
        array.sort((a, b) => {
          // Check if 'favorite' property is true or false
          const aFavorite = a.favorite ? 0 : 1;
          const bFavorite = b.favorite ? 0 : 1;
      
          // If both objects have the same 'favorite' status, sort alphabetically by 'name'
          if (aFavorite === bFavorite) {
            return a.name.localeCompare(b.name);
          }
      
          // Sort by 'favorite' status, placing 'favorite' objects before 'non-favorite'
          return aFavorite - bFavorite;
        });
      
        return array;
      }

    const openPassForm = useCallback((pass = undefined) => {
        if (mustSetPin) {
            return openSetPinDialog()
        }
        setPassObject(pass)
        setOpenForm(true)
    }, [mustSetPin, openSetPinDialog])

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
                return sortByFavoritesAlphabetically(userPasses)
            })
        } else if (actionType === 'POST') {
            setUserPasses(passwords => sortByFavoritesAlphabetically([...passwords, pass]))
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

    /*----EFFECT----*/
    useEffect(() => {
        getUserPasses()
    }, [])
    

    /*----RENDER----*/
    return (
        <Fragment>
            <IconButton size="large" color="lightgreen" sx={{ justifySelf: 'end' }} onClick={() => openPassForm()}>
                <Add fontSize="large" sx={{ color: '#00FF00' }} />
            </IconButton>
            <TextField id="standard-basic" label="Search" variant="standard" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            <Grid container spacing={2}>
                {userPasses.filter(up => up.name.toUpperCase().includes(searchValue.toUpperCase())).map((pass, i) => (
                    <UserPassItem
                        key={i}
                        name={pass.name}
                        uri={pass.uri}
                        notes={pass.notes}
                        favorite={pass.favorite}
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
