import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import SideMenu from "../SideMenu/SideMenu"

export default () => {
    const theme = createTheme({palette: {mode: 'dark'}})

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            
            <SideMenu/>
        </ThemeProvider>
    )
}