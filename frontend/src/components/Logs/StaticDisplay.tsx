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