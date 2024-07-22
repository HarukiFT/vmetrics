import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

interface StyledCSSProps {
  type: string
}

const StyledSpan = styled('span')<StyledCSSProps>(({ theme, type }) => ({
  display: 'inline-block',
  backgroundColor:  type === 'player' ? theme.palette.secondary.dark : theme.palette.primary.dark,
  fontWeight: 500,
  padding: `${theme.spacing(.5)} ${theme.spacing(.5)}`
}))

const StaticTextDisplay: React.FC<{ template: string; values: string[][] }> = ({ template, values }) => {
  const regex = /\{(\d+)\}|\s+/g
  const splitted = template.split(regex).filter(Boolean).map((str, index) => {
    if (index % 2 === 0) {
      return ''
    } else if (str.match(/\d+/)) {
      return ''
    }
    return str
  });
  const subs: string[][] = []

  const matchRegex = /\{(\d+)\}/g
  let match

  while ((match = matchRegex.exec(template)) !== null) {
    const number = parseInt(match[1])
    subs.push(values[number])
}

  return (
    <Typography variant='body1' letterSpacing={.1}>
      {
        splitted.map((part, index) => {
          console.log(subs[index])
          return (
            <>
              {`${part} `}
              {subs[index] && <StyledSpan type={subs[index][0].substring(1)}>{subs[index][1]}</StyledSpan>}
              {subs[index] && ` `}
            </>
          )
        })  
      }
    </Typography>
  );
};


export default StaticTextDisplay;