import React from 'react'

import { Box, Card, CardContent, Grid, IconButton, Typography } from '@mui/material';

import { styled } from '@mui/material/styles';

import { Delete, Edit } from '@mui/icons-material';


const EllipsisTypography = styled(Typography)(({ lines = 1 }) => ({
    'display': '-webkit-box',
    'WebkitLineClamp': lines,
    'WebkitBoxOrient': 'vertical',
    'overflow': 'hidden'
}))

const UserPassItem = (props) => {
    /*----PROPS----*/
    const { name,
        uri,
        notes,
        handleEdit,
        handleDelete,
    } = props

    return (
        <Grid item xs sm="auto" sx={{ maxWidth: { sm: 300 } }}>
            <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                <CardContent sx={{ flex: '1' }}>
                    <Typography gutterBottom variant="subtitle1" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        {uri}
                    </Typography>
                    <EllipsisTypography variant="body2" color="text.secondary" lines="2">
                        {notes}
                    </EllipsisTypography>
                </CardContent>
                <Box sx={{ display: 'flex', flexDirection: { sm: 'column' }, justifyContent: { xs: 'flex-end' } }}>
                    <IconButton size="large" onClick={handleEdit}>
                        <Edit color="primary" />
                    </IconButton>
                    <IconButton size="large" onClick={handleDelete} sx={{ '&:hover svg': { color: 'red' } }}>
                        <Delete color="action" />
                    </IconButton>
                </Box>
            </Card>
        </Grid>
    )
}

export default UserPassItem
