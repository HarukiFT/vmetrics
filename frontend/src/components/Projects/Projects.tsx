import { Box, Button, Container, Divider, Grid, IconButton, Pagination, Paper, Skeleton, Stack, TextField, Typography } from "@mui/material"
import SortIcon from '@mui/icons-material/Sort';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import TrashIcon from '@mui/icons-material/DeleteOutline';
import KeyIcon from '@mui/icons-material/KeyOutlined';
import AddIcon from '@mui/icons-material/AddOutlined';
import { useEffect, useState } from "react";
import { ProjectData } from "./Project.interface";
import axiosRequest from "../../shared/services/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const pageSize = 9

export default () => {
    const [projectsData, setProjectsData] = useState<ProjectData[]>([])
    const [page, setPage] = useState<number>(1)

    const navigate = useNavigate()

    useEffect(() => {
        const proceed = async () => {
            try {
                setProjectsData(await axiosRequest.get<ProjectData[]>('/projects/fetch'))
            } catch {
                setProjectsData([])


            }
        }

        setPage(1)
        proceed()
    }, [])

    const handleAdd = () => {
        navigate('/newproject')
    }

    return (
        <Box position={'relative'} width={1} p={3} flexGrow={1} display={"flex"} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            <Container maxWidth="xl">
                <Typography textAlign={'left'} mb={2} variant="h4" color={'primary.light'}>
                    Проекты
                </Typography>

                <Paper elevation={5} sx={{ py: 1, px: 2, mb: 2}}>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <TextField size="small" fullWidth placeholder="Поиск проекта"></TextField>
                        </Grid>

                        <Grid item xs={3}>
                            <IconButton>
                                <SortIcon />
                            </IconButton>
                        </Grid>

                        <Grid item display={"flex"} justifyContent={"flex-end"} xs={5}>
                            <Button onClick={handleAdd} color="success" variant="contained">
                                <AddIcon />
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper elevation={5} sx={{ py: 1, px: 2, mb: 1 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={1}>
                            <Typography variant="h6" letterSpacing={.3}>
                                #
                            </Typography>
                        </Grid>

                        <Divider />

                        <Grid item xs={3}>
                            <Typography variant="h6" letterSpacing={.3}>
                                Имя
                            </Typography>
                        </Grid>

                        <Grid item xs={3}>
                            <Typography variant="h6" letterSpacing={.3}>
                                Клиент
                            </Typography>
                        </Grid>

                        <Grid item xs={5}>
                            <Typography variant="h6" textAlign={'right'} letterSpacing={.3}>
                                Действия
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                <Stack direction={"column"} spacing={1}>
                    {
                        projectsData.slice((page - 1) * pageSize, page * pageSize).map((projectData, index) => (
                            <Paper elevation={5} key={projectData._id} sx={{ py: 1, px: 2 }}>
                                <Grid container alignItems={'center'} spacing={1}>
                                    <Grid item xs={1}>
                                        <Typography variant="h6" letterSpacing={.3}>
                                            #{(page - 1) * pageSize + (index + 1)}                                            
                                        </Typography>
                                    </Grid>

                                    <Divider />

                                    <Grid item xs={3}>
                                        <Typography variant="h6" letterSpacing={.3}>
                                            {projectData.name}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Typography variant="h6" letterSpacing={.3}>
                                            {projectData.client}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={5} display={'flex'} justifyContent={'end'}>
                                        <IconButton>
                                            <SettingsIcon />
                                        </IconButton>

                                        <Divider sx={{ mx: .5 }} variant="middle" flexItem orientation="vertical" />

                                        <IconButton>
                                            <TrashIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))
                    }
                </Stack>
            </Container>

            <Pagination size="large" variant="outlined" shape="rounded" onChange={(_, page) => {setPage(page)}} count={Math.ceil(projectsData.length / pageSize)} page={page} sx={{
                position: 'absolute',
                left: '50%',
                bottom: '1em',
                transform: 'translateX(-50%)'
            }}/>
        </Box>
    )
}