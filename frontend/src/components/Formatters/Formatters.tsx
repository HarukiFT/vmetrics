import { Autocomplete, Box, Button, Grid, Paper, Stack, TextField, Typography, styled, useTheme } from "@mui/material"
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProjectData } from "../Projects/Project.interface";
import axiosRequest from "../../shared/services/axiosInstance";
import { toast } from "react-toastify";
import { Editor, EditorState, RichUtils, CompositeDecorator, ContentBlock, ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';
interface FormatType {
  timestamp: Date,
  project: string,
  formatTable: {},
  format: string,
  action: string,
  _id: string
} 

type StrategyCallback = (start: number, end: number) => void;

const handleStrategy = (contentBlock: ContentBlock, callback: StrategyCallback, contentState: ContentState) => {
  const text = contentBlock.getText();
  const regex = /@[\w\/]+/g;
  let matchArr: RegExpExecArray | null;
  while ((matchArr = regex.exec(text)) !== null) {
    const start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
};

const HandleSpan: React.FC<{ children: React.ReactNode; decoratedText: string }> = (props) => {
  const theme = useTheme();
  return (
    <span
      style={{
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        cursor: 'pointer',
        padding: '2px 4px',
        borderRadius: '4px'
      }}
      onClick={() => alert(`Clicked on ${props.decoratedText}`)}
    >
      {props.children}
    </span>
  );
};

const decorator = new CompositeDecorator([
  {
    strategy: handleStrategy,
    component: HandleSpan,
  },
]);

const StyledEditorContainer = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  '& .DraftEditor-root': {
    minHeight: 'inherit'
  }
}));

const FormatInput = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty(decorator));

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
  };

  return (
    <Box p={2}>
      <StyledEditorContainer>
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
        />
      </StyledEditorContainer>
    </Box>
  );
}

export default () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectParam = searchParams.get('project');
  const [projectData, setProjectData] = useState<ProjectData>()
  const [actions, setActions] = useState<string[]>()
  const [formats, setFormats] = useState<FormatType[]>([])

  useEffect(() => {
    const proceed = async () => {
      try {
        const projectData = await axiosRequest.get<ProjectData>(`/projects/get`, {
          headers: {
            ['project-id']: projectParam
          }
        } as any)
        const actions = await axiosRequest.get<string[]>('/logs/actions', {
          headers: {
            ['project-id']: projectParam
          }
        } as any)

        setProjectData(projectData)
        setActions(actions)
      } catch {
        toast.error('Непредвиденная ошибка')
      }
    }

    proceed()
  }, [projectParam])

  useEffect(() => {
    axiosRequest.get<any>('/formats/fetch', {
      headers: {
        ['project-id']: projectParam
      }
    } as any).then(data => {
      setFormats(data.map((format: Record<string, any>) => {
        return {
          _id: format._id,
          project: format.project,
          formatTable: format.formatTable,
          format: format.format,
          action: format.action,
          timestamp: new Date(format.timestamp),
        }
      }))
    }).catch(err => {
      toast.error('Непредвиденная ошибка')
    })
  }, [])

  return (
    <Box width={1} padding={3} flexGrow={1} display={'flex'} flexDirection={'column'}>
      <Typography variant="h4">Формат строки для {projectData?.name}</Typography>

      <Stack direction={'column'} alignItems={'center'} width={1} flexGrow={1} mt={5}>
        <Paper elevation={5} sx={{ px: 2, py: 0, width: 1 }}>
          <Grid container spacing={.5} alignItems={'center'}>
            <Grid item xs={2}>
              <Autocomplete fullWidth options={actions?.map((action, index) => ({ label: action, id: index })) ?? []} renderInput={(params) => <TextField {...params} label="Событие" />} freeSolo />
            </Grid>

            <Grid item xs={4}>
              <FormatInput />
            </Grid>

            <Grid item xs display={"flex"} justifyContent={'end'}>
              <Button color="success" size="large" variant="outlined">
                Добавить
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Stack direction={'column'} spacing={1} mt={2} width={1}>
          <Paper elevation={5} sx={{ p: 2, width: 1 }}>
            
          </Paper>
        </Stack>
      </Stack>
    </Box>
  )
}