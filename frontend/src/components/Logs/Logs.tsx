import { Autocomplete, AutocompleteRenderInputParams, Box, Button, ClickAwayListener, useTheme, styled, Divider, Drawer, Grid, Icon, IconButton, MenuItem, MenuList, Pagination, Paper, Popper, Stack, TextField, Typography, useScrollTrigger } from "@mui/material"
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { ProjectData } from "../Projects/Project.interface";
import axiosRequest from "../../shared/services/axiosInstance";
import { toast } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";
import StaticTextDisplay from "./StaticDisplay";

interface FilterType {
    compare?: string
    value?: string
    field?: string
}

interface FilterProps {
    appliedFilter: Record<number, FilterType>
    fields: { label: string, id: number }[]
    onUpdate: (filters: Record<number, FilterType>) => void
    actions: {label: string, id: number}[]
}

interface LogLineType {
    timestamp: string
    string?: string
    params?: string[][] 
}

const pageSize = 12

const comparesOptions = [
    { label: '=', id: 1 },
    { label: '>', id: 2 },
    { label: '<', id: 3 }
]

const LogLine = () => {
    return (
        <Paper sx={{ width: '100%', p: 1.5 }} elevation={5}>
            <Typography variant="body1">Строка логов</Typography>
        </Paper>
    )
}

const PopperWithFilters: React.FC<FilterProps> = ({ onUpdate, appliedFilter, fields, actions }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null)
    const anchorRef = useRef<HTMLButtonElement>(null)

    const [filters, setFilters] = useState<Record<number, FilterType>>(appliedFilter)
    const [open, setOpen] = useState(false)

    const getFreeFields = () => {
        return fields.filter(field => {
            return !Object.entries(filters).find(([_, filter]) => {
                return (filter.field == field.label)
            })
        })
    }

    const handleChangeParam = (key: number, field: string) => (event: React.SyntheticEvent, value: { label: string; id: number; } | null, reason: string) => {
        setFilters(prevFilters => {
            const updateFilters = { ...prevFilters }

            updateFilters[key] = {
                ...updateFilters[key],
                [field]: value?.label
            }

            return updateFilters
        })
    }

    const handleChangeValue = (key: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prevFilters => {
            const updateFilters = { ...prevFilters }

            updateFilters[key] = {
                ...updateFilters[key],
                value: event.target.value
            }

            return updateFilters
        })
    }

    const handleRemoveFilter = (key: number) => {
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            delete newFilters[key];
            return newFilters;
        });
    }

    const handleAddFilter = () => {
        setFilters({
            ...filters,
            [Date.now()]: {}
        })
    }

    const handleClick = () => {
        setAnchorEl(anchorEl ? null : anchorRef.current)
        setOpen(!open)
    };

    const handleClose = () => {
        if (open) {
            setAnchorEl(anchorEl ? null : anchorRef.current)
            setOpen(!open)
        }
    }

    useEffect(() => {
        setFilters(appliedFilter)
    }, [appliedFilter])

    useEffect(() => {
        onUpdate(filters)
    }, [filters])

    return (
        <Box>
            <Button ref={anchorRef} onClick={handleClick} color="secondary" size="medium">
                <FilterIcon fontSize="medium" />
            </Button>
            <Popper open={open} anchorEl={anchorEl} role={undefined} placement="bottom-start">
                <Paper elevation={5} sx={{ width: 550, px: 1, py: 2 }}>
                    <ClickAwayListener onClickAway={handleClose}>
                        <Stack direction={"column"}>
                            <Stack direction={'row'} justifyContent={'flex-end'}>
                                <Button onClick={handleAddFilter} color="success">
                                    <AddIcon />
                                </Button>
                            </Stack>

                            {
                                Object.keys(filters).map((filterId: any) => {
                                    return (
                                        <>
                                            <Divider sx={{ my: 1 }} />
                                            <Stack direction={'row'} alignItems={'center'} spacing={1} key={filterId}>
                                                <IconButton onClick={() => {
                                                    handleRemoveFilter(filterId)
                                                }} size={'small'} sx={{ aspectRatio: 1 }}>
                                                    <CloseIcon />
                                                </IconButton>

                                                <Autocomplete isOptionEqualToValue={(option) => {
                                                    return (option.label === filters[filterId]?.field)
                                                }} sx={{ width: '30%' }} size="small" options={getFreeFields()} value={fields.find((option) => option.label == filters[filterId].field)} onChange={handleChangeParam(filterId, 'field')} renderInput={function (params: AutocompleteRenderInputParams): ReactNode {
                                                    return <TextField label={'Поле'} {...params}></TextField>
                                                }} />

                                                <Autocomplete size="small" sx={{ width: '20%' }} value={comparesOptions.find((option) => option.label == filters[filterId].compare)} options={comparesOptions} onChange={handleChangeParam(filterId, 'compare')} renderInput={(params: AutocompleteRenderInputParams): ReactNode => {
                                                    return <TextField label={'Сравнение'} {...params}></TextField>
                                                }} />

                                                {
                                                    filters[filterId].field === 'action' ?
                                                        <Autocomplete size="small" sx={{width: '40%'}} isOptionEqualToValue={(option) => {
                                                            return (option.label === filters[filterId]?.value)
                                                        }} value={actions.find((option) => option.label == filters[filterId].value)} onChange={handleChangeParam(filterId, 'value')} options={actions} renderInput={(params: AutocompleteRenderInputParams): ReactNode => {
                                                            return <TextField label={'Событие'} {...params}></TextField>
                                                        }}/>    
                                                    : <TextField onChange={handleChangeValue(filterId)} size="small" autoComplete='off' label='Значение' value={filters[filterId].value} /> 
                                                }
                                            </Stack>
                                        </>
                                    )
                                })
                            }
                        </Stack>
                    </ClickAwayListener>
                </Paper>
            </Popper>
        </Box>
    );
};

export default () => {
    const navigate = useNavigate()

    const [projectsData, setProjectsData] = useState<ProjectData[]>([])
    const [appliedFilters, setFilters] = useState<Record<number, FilterType>>({})
    const [fields, setFields] = useState<{ label: string, id: number }[]>([])
    const [selectedProject, setSelectedProject] = useState<string>()
    const [sender, setSender] = useState<string>()
    const [logs, setLogs] = useState([])
    const [logsCount, setLogsCount] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [prevAction, setAction] = useState<string>()
    const [actions, setActions] = useState<string[]>()

    const updateFields = async () => {
        if (selectedProject === undefined) {
            setFields([])
            setLogsCount(0)
            return
        };

        const actionFilter = Object.entries(appliedFilters).find(([_, filter]) => Boolean(filter.field == 'action'))

        try {
            const fields = await axiosRequest.get<string[]>(`/logs/fields?filter=action=${actionFilter ? actionFilter[1].value : '-1'}`, {
                headers: {
                    ['project-id']: selectedProject
                }
            } as any)

            setFields(fields.length > 0 ? fields.map((field, index) => ({
                label: field,
                id: index
            })) : [{ label: 'action', id: 1 }])
        } catch {
            setFields([{ label: 'action', id: 1 }])
            toast.error('Непредвиденная ошибка')
        }
    }

    const updateLogs = async () => {
        try {
            const filterList: string[] = []

            for (let [, filter] of Object.entries(appliedFilters)) {
                if (filter.field && filter.compare && filter.value) {
                    filterList.push(`${filter.field}${filter.compare}${filter.value}`)
                }
            }

            const logs = await axiosRequest.get(`logs/get?filter=sender=${sender},${filterList.join(',')}&page=${page}&limit=${pageSize}`, {
                headers: {
                    ['project-id']: selectedProject
                }
            } as any)

            setLogs(logs as [])
        } catch {

        }
    }

    useEffect(() => {
        updateFields()
        setFilters({})
        setLogs([])

        if (selectedProject) {
            axiosRequest.get<string[]>('/logs/actions', {
                headers: {
                    ['project-id']: selectedProject
                }
            } as any).then(actions => {
                setActions(actions)
            }).catch(() => {
                toast.error('Непредвиденная ошибка')
            })
        }
    }, [selectedProject])

    useEffect(() => {
        const currentAction = Object.entries(appliedFilters).find(([_, filter]) => filter.field == 'action')
        if (!currentAction) {
            if (prevAction) {
                setFields([{label: 'action', id: 1}])
            }

            return
        }

        if (prevAction !== currentAction[1].value) {
            setAction(currentAction[1].value)

            if (actions?.find((action) => action === currentAction[1].value)) {
                updateFields()
            } else {
                setFields([{label: 'action', id: 1}])
            }
        }
    }, [appliedFilters])

    useEffect(() => {
        const proceed = async () => {
            try {
                const projects = await axiosRequest.get<ProjectData[]>('/projects/fetch')
                setProjectsData(projects)
            } catch {
                toast.error('Непредвиденная ошибка')
            }
        }

        proceed()
    }, [])

    useEffect(() => {
        updateLogs()
    }, [page])

    const handleSenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setSender(undefined)
        } else {
            setSender(isNaN(parseInt(e.target.value)) ? '@player/' + e.target.value : e.target.value)
        }
    }

    const handleFind = () => {
        if (!selectedProject) return;

        const filterList: string[] = []

        for (let [, filter] of Object.entries(appliedFilters)) {
            if (filter.field && filter.compare && filter.value) {
                filterList.push(`${filter.field}${filter.compare}${filter.value}`)
            }
        }

        const proceed = async () => {
            try {
                const logs = await axiosRequest.get(`logs/get?filter=${(sender ? `sender=${sender},` : '')}${filterList.join(',')}&page=1&limit=${pageSize}`, {
                    headers: {
                        ['project-id']: selectedProject
                    }
                } as any)

                const logsCount = await axiosRequest.get<number>(`logs/count?filter=${(sender ? `sender=${sender},` : '')}${filterList.join(',')}`, {
                    headers: {
                        ['project-id']: selectedProject
                    }
                } as any)
                setLogsCount(logsCount)
                setPage(1)
                setLogs(logs as [])
            } catch (err) {
                toast.error('Непредвиденная ошибка')
            }
        }

        proceed()
    }

    return (
        <Box width={1} padding={3} flexGrow={1} display={'flex'} flexDirection={'column'}>
            <Stack direction={"row"} alignItems={'center'} mb={5} width={1}>
                <Box display={'flex'} flexGrow={1}>
                    <Typography variant="h4" mr={2}>Аудит логов - </Typography>
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

                <Button color="info" variant="contained" size="large" sx={{
                    display: !selectedProject ? 'none' : 'block' 
                }} onClick={() => {
                    navigate(`/formatters?project=${selectedProject}`)
                }}>
                    Форматирование
                </Button>
            </Stack>

            <Paper sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems={'center'}>
                    <Grid item xs={4}>
                        <TextField size="medium" autoComplete="off" onChange={handleSenderChange} fullWidth label={isNaN(parseInt(sender ?? '0')) ? 'Имя инициатора' : 'ID инициатора'} placeholder="Целевой инициатор"></TextField>
                    </Grid>

                    <Grid item flexGrow={1}>
                        <PopperWithFilters onUpdate={(filters) => {
                            setFilters(filters)
                        }} appliedFilter={appliedFilters} fields={fields} actions={actions?.map((action, index) => ({label: action, id: index})) ?? []}/>
                    </Grid>

                    <Grid item xs={1}>
                        <Button onClick={handleFind} fullWidth size="large" color={"success"} variant="outlined">
                            <SearchIcon fontSize="medium" />
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Stack alignItems={'center'} direction={'column'} mt={2} spacing={1}>
                {
                    logs.map((log: LogLineType) => {
                        return (
                            <Paper elevation={5} sx={{
                                width: 1,
                            }}>
                                <Grid container display={'flex'} alignItems={'center'}>
                                    <Grid item sx={{p: 1}}>
                                        <Typography variant="body1">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </Typography>
                                    </Grid>

                                    <Divider orientation="vertical" flexItem/>

                                    <Grid item sx={{p: 1}}>
                                        {<StaticTextDisplay template={log.string ?? 'Не найдено'} values={log.params || []}/>}
                                    </Grid>
                                </Grid>
                            </Paper>
                        )
                    })
                }
            </Stack>

            <Pagination size="large" variant="outlined" shape="rounded" onChange={(_, page) => { setPage(page) }} count={Math.ceil(logsCount / pageSize)} page={page} sx={{
                position: 'fixed',
                left: '50%',
                bottom: '1em',
                transform: 'translateX(-50%)'
            }} />
        </Box>
    )
}