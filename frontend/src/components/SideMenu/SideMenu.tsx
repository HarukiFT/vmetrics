import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"

export default () => {
    return (
        <Drawer variant="persistent" open={true}>
            <List>
                <ListItem>
                    <ListItemButton>
                        <ListItemIcon>

                        </ListItemIcon>
                        <ListItemText>First item</ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    )
}