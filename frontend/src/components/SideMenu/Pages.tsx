import LogsIcon from '@mui/icons-material/ClearAll';
import ProjectsIcon from '@mui/icons-material/FolderCopy';

export const pages = [   
    {
        icon: ProjectsIcon,
        href: '/projects',
        label: 'Проекты',
        isProtected: true
    },

    {
        icon: LogsIcon,
        href: '/logs',
        label: 'Логи',
        isProtected: true
    },
]