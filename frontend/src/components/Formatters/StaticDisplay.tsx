import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

interface StyledCSSProps {
  type: string
}

const StyledSpan = styled('span')<StyledCSSProps>(({ theme, type }) => ({
  display: 'inline-block',
  backgroundColor: type === 'player' ? theme.palette.secondary.dark : theme.palette.primary.dark,
  fontWeight: 500,
  padding: `${theme.spacing(.5)} ${theme.spacing(.5)}`
}))

const StaticTextDisplay: React.FC<{ template: string }> = ({ template }) => {
  const regex = /(@\w+\/\w+)/g
  const parts: string[] = []
  const subs: string[][] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(template)) !== null) {
    if (match.index > lastIndex) {
      parts.push(template.substring(lastIndex, match.index))
    }
    parts.push(match[0])
    const splittedMatch = match[0].split('/')
    subs.push([splittedMatch[0], splittedMatch[1]])
    lastIndex = regex.lastIndex
  }

  if (lastIndex < template.length) {
    parts.push(template.substring(lastIndex))
  }

  return (
    <Typography variant='body1' letterSpacing={0.25}>
      {parts.map((part, index) => {
        if (subs.length > 0 && part === `${subs[0][0]}/${subs[0][1]}`) {
          const [matchType, matchField] = subs.shift()!
          return (
            <StyledSpan key={index} type={matchType.substring(1)}>
              {matchType}/{matchField}
            </StyledSpan>
          )
        }
        return (
          <React.Fragment key={index}>
            {part}
          </React.Fragment>
        )
      })}
    </Typography>
  )
}


export default StaticTextDisplay