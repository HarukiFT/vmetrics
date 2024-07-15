import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import SideMenu from "../SideMenu/SideMenu"
import { Outlet } from "react-router-dom"

export default () => {
    const theme = createTheme({palette: {mode: 'dark'}})

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            
            <SideMenu/>

            <Box width={1} display={"flex"} flexDirection={'column'} flexGrow={1} ml={'200px'}>
                <Outlet/>
            </Box>
        </ThemeProvider>
    )
}