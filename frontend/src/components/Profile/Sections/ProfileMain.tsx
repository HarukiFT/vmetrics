import MainIcon from '@mui/icons-material/CreateOutlined';
import { Box, Grid, Stack, TextField, Typography } from "@mui/material"

export default () => {
    return (
        <Stack direction={'column'} height={1} width={1} py={2} px={14} alignItems={'center'}>
            <Box width={1} sx={(theme) => ({ 
                bgcolor: 'rgba(40, 40, 40, 1)', 
                boxSizing: 'content-box',
                borderRadius: theme.shape.borderRadius
                })} p={3} mb={3} display={'flex'}>
                <MainIcon sx={{ fontSize: '3em', mr: 3, alignSelf: 'end' }}/>
                <Stack direction={'column'}>
                    <Typography variant='h5' fontWeight={500} letterSpacing={.5}>
                        Основная информация
                    </Typography>

                    <Typography variant='h6' sx={{opacity: .8}} fontWeight={500} letterSpacing={.5}>
                        Тут хранится основная информация
                    </Typography>
                </Stack>
            </Box>

            <Grid container justifyContent={'space-between'}>
                <Grid item xs={5}>
                    <TextField label='Имя' fullWidth />
                </Grid>
                <Grid item xs={5}>
                    <TextField label='Фамилия' fullWidth />
                </Grid>
            </Grid>


        </Stack>
    )
}