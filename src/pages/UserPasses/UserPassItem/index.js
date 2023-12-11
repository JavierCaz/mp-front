import React from 'react'

import { Box, Card, CardContent, Grid, IconButton, Typography } from '@mui/material';

import { styled } from '@mui/material/styles';

import { Delete, Edit, Star } from '@mui/icons-material';


const EllipsisText = styled(Typography)(({ lines = 1 }) => ({
    'display': '-webkit-box',
    'WebkitLineClamp': lines,
    'WebkitBoxOrient': 'vertical',
    'overflow': 'hidden'
}))

const EllipsisTextLine = styled(Typography)(({ maxWidth = '200px' }) => ({
    'overflow': 'hidden',
    'textOverflow': 'ellipsis',
    'whiteSpace': 'nowrap',
    'maxWidth': maxWidth,
}))

const UserPassItem = (props) => {
    /*----PROPS----*/
    const { name,
        uri,
        notes,
        handleEdit,
        favorite,
        handleDelete,
    } = props

    const getFaviconDomainFromUri = (uri) => {
        let domain = uri;
        
        // Find & remove protocol (http, ftp, etc.) and get domain
        if (domain.indexOf("://") > -1) {
          domain = domain.split('/')[2];
        } else {
          domain = domain.split('/')[0];
        }
        
        // Find & remove port number
        domain = domain.split(':')[0];
        
        return 'http://www.google.com/s2/favicons?domain=' + domain;
    }

    return (
        <Grid item xs sm="auto" sx={{ maxWidth: { sm: 400 } }}>
            <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                <CardContent sx={{ flex: '1' }}>
                    
                    <Grid container alignItems="center">
                        <Grid item>
                            <Typography gutterBottom variant="subtitle1" component="div">
                                {name}
                            </Typography>
                        </Grid>
                        <Grid item>
                            {favorite && <Star fontSize="small" color="primary" sx={{marginLeft: '3px'}}/>}
                        </Grid>
                    </Grid>

                    <Grid container alignItems="center">
                        <Grid item>
                            <img height="18" width="18" src={getFaviconDomainFromUri(uri)} style={{marginRight: '5px'}} />
                        </Grid>
                        <Grid item>
                            <EllipsisTextLine variant="body2" gutterBottom>
                                {uri}
                            </EllipsisTextLine>
                        </Grid>
                    </Grid>

                    <EllipsisText variant="body2" color="text.secondary" lines="2">
                        {notes}
                    </EllipsisText>
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
