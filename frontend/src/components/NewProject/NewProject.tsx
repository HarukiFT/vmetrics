import { Box, Button, Stack, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material"
import { ChangeEvent, FormEvent, useState } from "react"
import axiosRequest from "../../shared/services/axiosInstance"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

interface StepProps {
    onComplete: (fields: Record<string, any>) => void
}

const MainStep = ({onComplete} : StepProps) => {
    const [name, setName] = useState<string>()
    const [validationError, setValidationError] = useState<string>()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)

        if (e.target.value === '') {
            setValidationError('Имя проекта не может быть пустым')
        } else if (e.target.value.length > 16) {
            setValidationError('Имя проекта не может быть таким длинным')
        } else {
            setValidationError(undefined)
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (validationError) return;

        onComplete({
            name
        })
    }

    return (
        <Stack width={.4} direction={"column"} alignItems={'center'}>
            <Typography variant="h4" textAlign={'center'} mb={0}>Основное</Typography>
            <Typography variant="h6" textAlign={'center'} color={'grey.500'} mb={2}>Введите основную информацию о проекте</Typography>

            <Box component={'form'} onSubmit={handleSubmit} width={.6} noValidate>
                <TextField error={validationError ? true : false} name='name' required margin="normal" onChange={handleChange} helperText={validationError} label='Имя проекта' placeholder="Введите имя проекта" fullWidth/>
                <Button variant="contained" type="submit" disabled={Boolean(validationError) || !name} sx={{mt: 1}} fullWidth color="primary">Продолжить</Button>
            </Box>
        </Stack>
    )
}

const ClientStep = ({onComplete} : StepProps) => {
    const [name, setName] = useState<string>()
    const [validationError, setValidationError] = useState<string>()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)

        if (e.target.value.length > 16) {
            setValidationError('Имя клиента не может быть таким длинным')
        } else {
            setValidationError(undefined)
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (validationError) return;

        onComplete({
            client: name
        })
    }

    return (
        <Stack width={.4} direction={"column"} alignItems={'center'}>
            <Typography variant="h4" textAlign={'center'} mb={0}>О клиенте</Typography>
            <Typography variant="h6" textAlign={'center'} color={'grey.500'} mb={2}>Введите основную информацию о клиенте</Typography>

            <Box component={'form'} width={.6} noValidate onSubmit={handleSubmit}>
                <TextField error={validationError ? true : false} name='client' margin="normal" onChange={handleChange} helperText={validationError} label='Клиент' placeholder="Введите клиента" fullWidth/>
                <Button variant="contained" type="submit" disabled={Boolean(validationError) } sx={{mt: 1}} fullWidth color="primary">Продолжить</Button>
            </Box>
        </Stack>
    )
}

const MetricsStep = ({onComplete} : StepProps) => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        onComplete({
            
        })
    }

    return (
        <Stack width={.4} direction={"column"} alignItems={'center'}>
            <Typography variant="h4" textAlign={'center'} mb={0}>Настройка метрик</Typography>
            <Typography variant="h6" textAlign={'center'} color={'grey.500'} mb={2}>Пока не сделано</Typography>

            <Box component={'form'} width={.6} noValidate onSubmit={handleSubmit}>
                <Button variant="contained" type="submit" sx={{mt: 1}} fullWidth color="success">Создать проект</Button>
            </Box>
        </Stack>
    )
}

export default () => {
    const [fields, setFields] = useState<Record<string, any>>()
    const [step, setStep] = useState<number>(0)
    const navigate = useNavigate()

    const handleStepComplete = (updateFields: Record<string, any>) => {
        setFields({
            ...fields,
            ...updateFields
        })

        if (step == 2) {
            axiosRequest.post('/projects/create', fields).then(() => {
                toast.success('Проект создан')
                navigate('/projects')
            }).catch(() => {
                toast.error('Непредвиденная ошибка')
            })

            return
        }

        setStep(step + 1)
    } 

    return (
        <Box width={1} p={2} flexGrow={1} display={'flex'} flexDirection={'column'}>
            <Stepper alternativeLabel activeStep={step} variant="elevation">
                <Step>
                    <StepLabel>Основное</StepLabel>
                </Step>

                <Step>
                    <StepLabel>Клиент</StepLabel>
                </Step>

                <Step>
                    <StepLabel>Метрики</StepLabel>
                </Step>
            </Stepper>

            <Box width={1} flexGrow={1} display={'flex'} alignItems={"center"} justifyContent={'center'}>
                {
                    (() => {
                        switch (step) {
                            case 0:
                                return <MainStep onComplete={handleStepComplete}/>
                            case 1:
                                return <ClientStep onComplete={handleStepComplete} />
                            case 2:
                                return <MetricsStep onComplete={handleStepComplete}/>
                        }
                    })()
                }
            </Box>
        </Box>
    )
}