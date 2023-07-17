import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import UserPasses from './UserPasses/UserPasses'

const Home = () => {
    return (
        <Box
            sx={{
                display: 'grid',
                maxWidth: '80%',
                margin: 'auto',
                // justifyItems: 'center',
                gap: '1rem',
            }}
        >
            <Typography sx={{ textAlign: 'center' }} variant='h4'>Home Page</Typography>
            <UserPasses />
        </Box>
    )
}

export default Home
