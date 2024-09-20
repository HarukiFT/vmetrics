import { Avatar, Box, Button, ClickAwayListener, Container, Divider, Drawer, Fade, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper, Popper, SvgIconTypeMap, Toolbar, Tooltip, Typography, styled } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { pages } from "./Pages"
import { OverridableComponent } from "@mui/material/OverridableComponent"
import { useAuth } from "../../contexts/AuthContext/AuthContext"
import { createRef, useEffect, useRef, useState } from "react"
import ExitIcon from '@mui/icons-material/ExitToApp';
import ProfileIcon from '@mui/icons-material/AccountCircleOutlined';
import { toast } from "react-toastify"

const StyledLink = styled(Link)((t) => ({
    textDecoration: 'none',
    color: t.theme.palette.text.primary,
    width: '100%',
}))

const LoginFooter = () => {
    return (
        <Box width={1} px={3} display={"flex"} alignItems={'center'} justifyContent={"center"}>
            <Button variant="text" fullWidth>
                <StyledLink to={'/login'}>Войти</StyledLink>
            </Button>
        </Box>
    )
}

const ProfileFooter: React.FC<{username: string}> = ({username}) => {
    const {setToken, userData} = useAuth()

    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const anchorRef = useRef<HTMLButtonElement>(null)

    const handleClick = () => {
        setAnchorEl(anchorEl ? null : anchorRef.current)
    };

    const handleExit = () => {
        setToken('')
        navigate('/')

        toast.info('Вы вышли из системы')
    }

    return (
        <Box width={1} px={3} display={"flex"} alignItems={'center'} justifyContent={"center"}>
            <Button variant="outlined" ref={anchorRef} color="info" onClick={handleClick} sx={{px: 4, py: 1}}>
                <Typography fontWeight={300}>{username}</Typography>
            </Button>

            <Popper anchorEl={anchorEl} open={Boolean(anchorEl)} role={undefined} modifiers={[{
                        name: 'offset',
                        options: {
                            offset: [0, 20]
                        },
                }]} disablePortal transition placement="top-start">
                {
                    ({TransitionProps}) => (
                        <Fade {...TransitionProps} timeout={350}>
                                <Paper elevation={1}>
                                    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                                        <MenuList>
                                            <MenuItem onClick={() => {navigate('/profile')}} key={'profile'}>
                                                <ListItemIcon>
                                                    <ProfileIcon/>
                                                </ListItemIcon>
                                                <ListItemText>Профиль</ListItemText>
                                            </MenuItem>
                                            <Divider/>
                                            <MenuItem onClick={handleExit} key={'exit'}>
                                                <ListItemIcon>
                                                    <ExitIcon/>
                                                </ListItemIcon>
                                                <ListItemText>Выйти</ListItemText>
                                            </MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                        </Fade>
                    )
                }
            </Popper>
        </Box>
    );
}

const sideMenuWidth = 200

export default () => {
    const { userData } = useAuth()

    return (
        <Drawer sx={{
            '& .MuiDrawer-paper': {
                width: sideMenuWidth,
                py: 2
            }
        }} variant="permanent">
            <Box flexGrow={1}>
                <List>
                    {
                        pages.map(page => {
                            return (
                                <ListItem>
                                    <StyledLink to={page.isProtected && !userData ? '/login' : page.href}>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <page.icon />
                                            </ListItemIcon>
                                            <ListItemText>{page.label}</ListItemText>
                                        </ListItemButton>
                                    </StyledLink>
                                </ListItem>
                            )
                        })
                    }
                </List>
            </Box>
            {
                userData ? <ProfileFooter username={userData.username}/> : <LoginFooter/>
            }
        </Drawer>
    )
}