import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { ProjectData } from "../Projects/Project.interface";
import axiosRequest from "../../shared/services/axiosInstance";
import { useLocation } from "react-router-dom";

export default () => {
    const location = useLocation()
    const [projectData, setProjectData] = useState<ProjectData>()

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const projectParam = searchParams.get('project');

        axiosRequest.get<ProjectData>('/projects/get', {
            headers: {
                'project-id': projectParam
            }
        }).then((data) => {
            setProjectData(data)
        }).catch(() => {})
    }, [])

    return (
        <Box width={1} p={2} flexGrow={1} display={'flex'} flexDirection={'column'}>
            <Typography variant="h4">{projectData ? `Новая метрика для ${projectData.name}` : 'Загрузка...'}</Typography>
            <Stepper alternativeLabel activeStep={1} variant="elevation">
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

        </Box>
    )
}