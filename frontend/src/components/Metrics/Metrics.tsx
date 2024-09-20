import { Autocomplete, Box, Button, Container, Grid, Paper, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { ProjectData } from "../Projects/Project.interface"
import axiosRequest from "../../shared/services/axiosInstance"
import AddIcon from '@mui/icons-material/AddOutlined';
import { useNavigate } from "react-router-dom";

export default () => {
    const navigate = useNavigate()

    const [projectsData, setProjectsData] = useState<ProjectData[]>([])
    const [selectedProject, setSelectedProject] = useState<string>()

    useEffect(() => {
        axiosRequest.get<ProjectData[]>('/projects/fetch').then((projects) => {
            setProjectsData(projects)
        }).catch(() => { })
    }, [])

    return (
        <Box width={1} padding={3} flexGrow={1} display={'flex'} flexDirection={'column'}>
            <Stack direction={"row"} alignItems={'center'} mb={3} width={1}>
                <Box display={'flex'} flexGrow={1}>
                    <Typography variant="h4" mr={2}>Метрики - </Typography>
                    <Autocomplete disablePortal sx={{ width: '20%' }} onChange={(_, option) => {
                        setSelectedProject(option?._id)
                    }} options={projectsData} renderInput={(params) => {
                        return <TextField {...params} label="Проект" />
                    }}

                        getOptionLabel={(option) => option.name || ''}

                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props

                            return (
                                <Box component={'li'} {...optionProps}>
                                    {option.name}
                                </Box>
                            )
                        }}
                    />
                </Box>
            </Stack>

            <Box display={'flex'} width={1} justifyContent={'flex-end'} mb={2}>
                <Button variant="outlined" color="success" onClick={() => {navigate(`/newmetric?project=${selectedProject}`)}}>
                    <AddIcon/>
                </Button>
            </Box>

            <Box flexGrow={1} width={1}>
                <Grid container>
                    
                </Grid>
            </Box>
        </Box>
    )
}