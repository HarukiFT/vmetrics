import { Autocomplete, Box, Button, Divider, Grid, Pagination, Paper, Stack, TextField, Typography, styled, useTheme } from "@mui/material"
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProjectData } from "../Projects/Project.interface";
import axiosRequest from "../../shared/services/axiosInstance";
import { toast } from "react-toastify";
import { Editor, EditorState, RichUtils, CompositeDecorator, ContentBlock, ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import StaticTextDisplay from "./StaticDisplay";
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

const FormatInput: React.FC<{onChange: (content: string) => void}> = ({onChange}) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty(decorator));

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();
    const plainText = contentState.getPlainText();

    onChange(plainText)
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

const pageSize = 10

export default () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectParam = searchParams.get('project');
  const [projectData, setProjectData] = useState<ProjectData>()
  const [actions, setActions] = useState<string[]>()
  const [formats, setFormats] = useState<FormatType[]>([])
  const [lastUpdate, setUpdate] = useState<number>()
  const [page, setPage] = useState<number>(1)
  const [pending, setPending] = useState<boolean>(false)
  
  const [formatField, setFormatField] = useState<string>()
  const [actionField, setActionField] = useState<string>()

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
    }).finally(() => {
      setPage(1)
    })
  }, [lastUpdate])

  useEffect(() => {
    console.log(formatField, actionField)
  },[formatField, actionField])

  const handleFormatChange = (content: string) => {
    setFormatField(content)
  }

  const handleActionChange = (_: React.SyntheticEvent, value: string | { label: string; id: number; } | null) => {
      if (typeof(value) === 'string') {
        setActionField(value)
      } else {
        setActionField(value?.label)
      }
  }

  const handleAdd = () => {
    if (!actionField || actionField === '') return;
    if (!formatField || formatField === '') return;

    if (pending) return;

    setPending(true)

    axiosRequest.post('/formats/create', {
      action: actionField,
      format: formatField
    }, {
      headers: {
        ['project-id']: projectParam
      }
    }).then(() => {
      toast.success('Успешно')
    }).catch(err => {
      toast.error('Непредвиденная ошикба')
    }).finally(() => {
      setPending(false)
      setUpdate(Date.now())
    })
  }

  return (
    <Box width={1} padding={3} flexGrow={1} display={'flex'} flexDirection={'column'}>
      <Typography variant="h4">Формат строки для {projectData?.name}</Typography>

      <Stack direction={'column'} alignItems={'center'} width={1} flexGrow={1} mt={5}>
        <Paper elevation={5} sx={{ px: 2, py: 0, width: 1 }}>
          <Grid container spacing={.5} alignItems={'center'}>
            <Grid item xs={2}>
              <Autocomplete fullWidth options={actions?.map((action, index) => ({ label: action, id: index })) ?? []} onChange={handleActionChange} renderInput={(params) => <TextField {...params} label="Событие" />} freeSolo />
            </Grid>

            <Grid item xs={4}>
              <FormatInput onChange={handleFormatChange}/>
            </Grid>

            <Grid item xs display={"flex"} justifyContent={'end'}>
              <Button color="success" size="large" variant="outlined" onClick={handleAdd}>
                Добавить
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Stack direction={'column'} spacing={1} mt={2} width={1}>
            {
              formats.filter((_, index) => (index >= (page - 1) * pageSize) && (index < page * pageSize)).map(format => {
                return (
                  <Paper elevation={5} sx={{ p: 1, width: 1 }} key={format._id}>
                    <Grid container display={'flex'} alignItems={'center'}>
                      <Grid item xs={1} sx={{ p: 1 }}>
                        <Typography variant="h6" fontWeight={600} letterSpacing={.25}>
                          {format.action}
                        </Typography>
                      </Grid>

                      <Grid item flexGrow={1}>
                        {<StaticTextDisplay template={format.format}/>}
                      </Grid>

                      <Grid item xs={1.5} display={'flex'} justifyContent={'end'}>
                      <Typography variant="body1" color={'grey.500'}>
                          {format.timestamp.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                )
              })
            }
        </Stack>
      </Stack>

      <Pagination size="large" variant="outlined" shape="rounded" onChange={(_, page) => { setPage(page) }} count={Math.ceil(formats.length / pageSize)} page={page} sx={{
        position: 'fixed',
        left: '50%',
        bottom: '1em',
        transform: 'translateX(-50%)'
      }} />
    </Box>
  )
}