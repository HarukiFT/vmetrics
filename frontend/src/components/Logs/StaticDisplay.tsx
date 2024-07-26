import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Theme } from 'react-toastify';

interface StyledCSSProps {
  type: string
}

const StyledSpan = styled('span')<StyledCSSProps>(({ theme, type }) => {
  const typeColors: Record<string, string> = {
    'player': theme.palette.secondary.dark,
    'action': theme.palette.primary.dark,
    'string': theme.palette.primary.dark,
    'placeholder': theme.palette.grey[700],
    'field': theme.palette.grey[700]
  }

  return {
    display: 'inline-block',
    backgroundColor: typeColors[type] ?? theme.palette.grey[700],
    fontWeight: 500,
    padding: `${theme.spacing(.5)} ${theme.spacing(.5)}`
  }
})

const StaticTextDisplay: React.FC<{ template: string, values: string[][] }> = ({ template, values }) => {
  const regex = /\{(\d+)\}/g
  const parts = template.split(regex)
  const result: (string | JSX.Element)[] = []

  let valueIndex = 0

  parts.forEach((part, index) => {
    if (index % 2 === 0) {
      result.push(part)
    } else {
      const valuePair = values[parseInt(part, 10)]
      if (valuePair) {
        const [matchType, matchField] = valuePair
        result.push(
          <StyledSpan key={valueIndex} type={matchType.substring(1)}>
            {matchField}
          </StyledSpan>
        )
        valueIndex++
      }
    }
  })

  return (
    <Typography variant='body1' letterSpacing={0.1}>
      {result}
    </Typography>
  )
}


export default StaticTextDisplay