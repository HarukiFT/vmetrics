import { Box, Button, Grid, TextField, Typography, styled } from "@mui/material"
import { Link } from "react-router-dom"

const AdditionalLink = styled(Link)((t) => ({
    color: t.theme.palette.info.main,
    width: '100%',
}))

export default () => {
    return (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} width={1} flexGrow={1}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={.2}>
                <Typography variant="h4" mb={2}>Регистрация</Typography>

                <Box component={'form'} width={1}>
                    <TextField fullWidth name="username" margin="normal" placeholder="Введите логин"></TextField>
                    <TextField fullWidth name="password" margin="normal" type="password" placeholder="Введите пароль"></TextField>
                    <Button type="submit" sx={{mt: 1}} fullWidth variant="contained">Создать аккаунт</Button>
                </Box>

                <Grid container mt={1} justifyContent={"flex-end"}>
                    <Grid item>
                        <AdditionalLink to="/login">Уже есть аккаунт</AdditionalLink>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}