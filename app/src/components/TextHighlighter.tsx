import { type ReactNode, type ReactElement } from 'react';
import { Box, Tooltip } from '@mui/material';

interface TextError {
  message: string;
  offset: number;
  length: number;
  rule?: string;
  category?: string;
}

interface TextHighlighterProps {
  text: string;
  errors: TextError[];
}

export const TextHighlighter = ({ text, errors }: TextHighlighterProps) => {
  if (!text || !errors.length) {
    return <Box component="pre" sx={{ whiteSpace: 'pre-wrap', m: 0 }}>{text}</Box>;
  }

  // Sort errors by offset to process them in order
  const sortedErrors = [...errors].sort((a, b) => a.offset - b.offset);
  const segments: ReactElement[] = [];
  let lastIndex = 0;

  sortedErrors.forEach((error, index) => {
    // Add text before the error
    if (error.offset > lastIndex) {
      segments.push(
        <span key={`text-${index}`}>
          {text.slice(lastIndex, error.offset)}
        </span>
      );
    }

    // Add highlighted error text
    const errorText = text.slice(error.offset, error.offset + error.length);
    segments.push(
      <Tooltip 
        key={`error-${index}`}
        title={error.message}
        arrow
        placement="top"
      >
        <Box
          component="span"
          sx={{
            backgroundColor: 'error.light',
            color: 'error.contrastText',
            px: 0.5,
            borderRadius: 0.5,
            cursor: 'pointer',
          }}
        >
          {errorText}
        </Box>
      </Tooltip>
    );

    lastIndex = error.offset + error.length;
  });

  // Add remaining text after last error
  if (lastIndex < text.length) {
    segments.push(
      <span key="text-end">
        {text.slice(lastIndex)}
      </span>
    );
  }

  return (
    <Box 
      component="pre" 
      sx={{ 
        whiteSpace: 'pre-wrap',
        m: 0,
        fontFamily: 'inherit',
        fontSize: 'inherit'
      }}
    >
      {segments}
    </Box>
  );
};

export default TextHighlighter; 