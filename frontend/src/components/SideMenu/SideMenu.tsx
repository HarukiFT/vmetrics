import { Avatar, Box, Button, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SvgIconTypeMap, Toolbar, Tooltip, styled } from "@mui/material"
import { Link } from "react-router-dom"
import { pages } from "./Pages"
import { OverridableComponent } from "@mui/material/OverridableComponent"

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

const ProfileFooter = () => {
    return (
       <Box width={1} px={3} display={"flex"} alignItems={'center'} justifyContent={"center"}>
            <Tooltip title="Профиль">
                <IconButton>
                    <Avatar  sx={{
                        backgroundColor: 'primary.dark'
                    }}>

                    </Avatar>
                </IconButton>
            </Tooltip>
       </Box> 
    )
}

export default () => {
    return (
        <Drawer sx={{
            '& .MuiDrawer-paper': {
                py: 2
            }
        }} variant="permanent">
            <Box flexGrow={1}>
                <List>
                    {
                        pages.map(page => {
                            return (
                                <ListItem>
                                    <StyledLink to={page.href}>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <page.icon/>
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

            <LoginFooter/>
        </Drawer>
    )
}