import { Box, Button, Grid, TextField, Typography, styled } from "@mui/material"
import { ChangeEvent, FormEvent, FormEventHandler, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import axiosRequest from "../../shared/services/axiosInstance"
import { useAuth } from "../../contexts/AuthContext/AuthContext"

const AdditionalLink = styled(Link)((t) => ({
    color: t.theme.palette.info.main,
    width: '100%',
}))

export default () => {
    const auth = useAuth()

    const [fields, setFields] = useState({
        username: null,
        password: null
    })
    const [isBusy, setBusy] = useState<boolean>(false)

    if (auth.userData) {
        window.location.href = '/'
    }

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
                const existResponse = await axiosRequest.get<boolean>(`/users/isexist?username=${fields.username}`)
                if (existResponse) { 
                    toast.error('Логин занят')
                    return
                }
                await axiosRequest.post('/users/register', fields)
                toast.success('Аккаунт успешно создан!')
            } catch (err: any) {
                toast.error(`Ошибка [${err.response.status}]`)
            }
        }

        proceed().finally(() => {
            setBusy(false)
        })
    }

    return (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} width={1} flexGrow={1}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={.2}>
                <Typography variant="h4" mb={2}>Регистрация</Typography>

                <Box component={'form'} onSubmit={handleSubmit} width={1}>
                    <TextField disabled={isBusy} fullWidth name="username" margin="normal" placeholder="Введите логин" onChange={handleInput}/>
                    <TextField disabled={isBusy} fullWidth name="password" margin="normal" type="password" placeholder="Введите пароль" onChange={handleInput}/>
                    <Button type="submit" disabled={isBusy} sx={{mt: 1}} fullWidth variant="contained">Создать аккаунт</Button>
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