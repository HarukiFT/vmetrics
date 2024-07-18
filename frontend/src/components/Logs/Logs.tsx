import { Autocomplete, AutocompleteRenderInputParams, Box, Button, ClickAwayListener, Divider, Drawer, Grid, Icon, IconButton, MenuItem, MenuList, Paper, Popper, Stack, TextField, Typography, useScrollTrigger } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { ProjectData } from "../Projects/Project.interface";
import axiosRequest from "../../shared/services/axiosInstance";
import { toast } from "react-toastify";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';

interface FilterType {
    compare?: string
    value?: string
    field?: string
}

interface FilterProps {
    appliedFilter: Record<number, FilterType>
    fields: { label: string, id: number }[]
    onUpdate: (filters: Record<number, FilterType>) => void
}

const comparesOptions = [
    { label: '=', id: 1 },
    { label: '>', id: 2 },
    { label: '<', id: 3 }
]

const PopperWithFilters: React.FC<FilterProps> = ({ onUpdate, appliedFilter, fields }) => {
    console.log(fields)

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
        console.log(key)

        setFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            delete newFilters[key];
            console.log(newFilters)
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
                <FilterIcon fontSize="medium"/>
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

                                                <Autocomplete key={'test_key'} size="small" sx={{ width: '20%' }} value={comparesOptions.find((option) => option.label == filters[filterId].compare)} options={comparesOptions} onChange={handleChangeParam(filterId, 'compare')} renderInput={function (params: AutocompleteRenderInputParams): ReactNode {
                                                    return <TextField label={'Сравнение'} {...params}></TextField>
                                                }} />

                                                <TextField onChange={handleChangeValue(filterId)} size="small" autoComplete='off' label='Значение' />
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
    const [projectsData, setProjectsData] = useState<ProjectData[]>([])
    const [appliedFilters, setFilters] = useState<Record<number, FilterType>>({})
    const [fields, setFields] = useState<{ label: string, id: number }[]>([])
    const [selectedProject, setSelectedProject] = useState<string>()
    const [sender, setSender] = useState<string>()
    const [logs, setLogs] = useState([])


    const updateFields = async () => {
        if (selectedProject === undefined) {
            setFields([])
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
            })) : [{label: 'action', id: 1}])
        } catch {
            setFields([{label: 'action', id: 1}])
            toast.error('Непредвиденная ошибка')
        }
    }

    useEffect(() => {
        updateFields()
        setFilters({})
    }, [selectedProject])

    useEffect(() => {
        updateFields()
    }, [appliedFilters])

    useEffect(() => {
        const proceed = async () => {
            try {
                const projects = await axiosRequest.get<ProjectData[]>('/projects/fetch')
                console.log(projects)
                setProjectsData(projects)
            } catch {
                toast.error('Непредвиденная ошибка')
            }
        }

        proceed()
    }, [])

    const handleSenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setSender(undefined)
        } else {
            setSender(isNaN(parseInt(e.target.value)) ? '@player/'+e.target.value : e.target.value)
        }
    }

    const handleFind = () => {
        if (!sender) return;
        if (!selectedProject) return;

        const filterList: string[] = []
        
        for (let [, filter] of Object.entries(appliedFilters)) {
            if (filter.field && filter.compare && filter.value) {
                 filterList.push(`${filter.field}${filter.compare}${filter.value}`)
            }
        }

        const proceed = async () => {
            try {
                const logs = await axiosRequest.get(`logs/get?filter=sender=${sender},${filterList.join(',')}`, {
                    headers: {
                        ['project-id']: selectedProject
                    }
                } as any)

                console.log(logs)
            } catch {
                toast.error('Непредвиденная ошибка')
            }
        }

        proceed()
    }

    return (
        <Box width={1} padding={3} flexGrow={1} display={'flex'} flexDirection={'column'}>
            <Stack direction={"row"} alignItems={'center'} mb={5} width={1}>
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
            </Stack>

            <Paper sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems={'center'}>
                    <Grid item xs={4}>
                        <TextField size="medium" autoComplete="off" onChange={handleSenderChange} fullWidth label={isNaN(parseInt(sender ?? '0')) ? 'Имя инициатора' : 'ID инициатора'} placeholder="Целевой инициатор"></TextField>
                    </Grid>

                    <Grid item flexGrow={1}>
                        <PopperWithFilters onUpdate={(filters) => {
                            setFilters(filters)
                        }} appliedFilter={appliedFilters} fields={fields} />
                    </Grid>

                    <Grid item xs={1}>
                        <Button onClick={handleFind} fullWidth size="large" color={"success"} variant="outlined">
                            <SearchIcon fontSize="medium"/>
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}