import {
  Box,
  Container,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  styled,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { profileSections } from "./Sections";
import ExitIcon from "@mui/icons-material/ExitToApp";
import ProfileMain from "./Sections/ProfileMain";

const StyledLink = styled(Link)((t) => ({
  textDecoration: "none",
  color: t.theme.palette.text.primary,
  width: "100%",
}));

const sections: Record<string, React.FC> = {
  main: ProfileMain,
};

export default () => {
  const location = useLocation();

  const SectionComponent =
    sections[location.hash.substring(1)] ?? sections["main"];

  return (
    <Box
      display={"flex"}
      width={1}
      flexGrow={1}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Container maxWidth={"lg"} disableGutters sx={{ display: "flex" }}>
        <Stack direction={"column"} width={0.2}>
          <Paper elevation={5} sx={{ width: 1, aspectRatio: 1, mb: 2 }}>
            {
              //TODO
            }
          </Paper>

          <Paper elevation={4} sx={{ width: 1 }}>
            <List sx={{ width: 1 }}>
              {profileSections.map((section, index) => {
                return (
                  <ListItem disableGutters sx={{ pt: 0 }}>
                    <StyledLink to={section.href}>
                      <ListItemButton>
                        <ListItemIcon>
                          <section.icon />
                        </ListItemIcon>
                        <ListItemText>{section.label}</ListItemText>
                      </ListItemButton>
                    </StyledLink>
                  </ListItem>
                );
              })}
              <Divider />
              <ListItem disableGutters sx={{ pb: 0 }}>
                <ListItemButton>
                  <ListItemIcon>
                    <ExitIcon />
                  </ListItemIcon>
                  <ListItemText>Выйти</ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Stack>

        <Paper sx={{ flexGrow: 1, ml: 3 }} elevation={5}>
          <SectionComponent />
        </Paper>
      </Container>
    </Box>
  );
};
