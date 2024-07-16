import { Box, Typography, TextField, Button, Grid, styled } from "@mui/material"
import { useState, FormEvent } from "react"
import { toast } from "react-toastify"
import axiosRequest from "../../shared/services/axiosInstance"
import { Link } from "react-router-dom"

const AdditionalLink = styled(Link)((t) => ({
    color: t.theme.palette.info.main,
    width: '100%',
}))

export default () => {
    const [fields, setFields] = useState({
        username: null,
        password: null
    })
    const [isBusy, setBusy] = useState<boolean>(false)

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFields({
            ...fields,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (isBusy) return;

        setBusy(true)

        const proceed = async () => {
            try {
                const token = await axiosRequest.post<{token: string}>(`/auth/auth`, fields)
                toast.success('Добро пожаловать!')
            } catch (err: any) {
                if (err.response.status === 400) {
                    toast.error(`Неверные данные`)
                } else {
                    toast.error('Непредвиденная ошибка')
                }
                
            }
        }

        proceed().finally(() => {
            setBusy(false)
        })
    }

    return (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} width={1} flexGrow={1}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={.2}>
                <Typography variant="h4" mb={2}>Авторизация</Typography>

                <Box component={'form'} onSubmit={handleSubmit} width={1}>
                    <TextField disabled={isBusy} fullWidth name="username" margin="normal" placeholder="Введите логин" onChange={handleInput}/>
                    <TextField disabled={isBusy} fullWidth name="password" margin="normal" type="password" placeholder="Введите пароль" onChange={handleInput}/>
                    <Button type="submit" disabled={isBusy} sx={{mt: 1}} fullWidth variant="contained">Войти</Button>
                </Box>

                <Grid container mt={1} justifyContent={"flex-end"}>
                    <Grid item>
                        <AdditionalLink to="/register">Нет аккаунта?</AdditionalLink>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}