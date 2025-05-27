import { TextField } from '@mui/material';
import type { ChangeEvent } from 'react';
import { styled } from '@mui/material/styles';

interface TextError {
  message: string;
  offset: number;
  length: number;
  rule?: string;
  category?: string;
  replacements: Array<{ value: string }>;
}

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  rows?: number;
  error?: boolean;
  helperText?: string;
  errors?: TextError[];
  selectedError?: TextError | null;
}

// Create a styled div for the highlighting overlay
const HighlightOverlay = styled('div')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  color: 'transparent',
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
  overflow: 'hidden',
  backgroundColor: 'transparent',
  '& mark': {
    color: 'transparent',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderBottom: `2px solid rgba(244, 67, 54, 0.3)`,
    borderRadius: '2px',
    margin: '-2px',
    padding: '2px',
  },
  '& mark.selected': {
    backgroundColor: 'rgba(255, 241, 118, 0.2)',
    borderBottom: '2px solid rgba(255, 214, 79, 0.3)',
  }
}));

// Create a styled wrapper div
const TextFieldWrapper = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '& .MuiInputBase-root': {
    position: 'relative',
    backgroundColor: 'transparent',
    height: '100%',
  },
  '& textarea': {
    backgroundColor: 'transparent',
    height: '100% !important', // Override Material-UI's height
  }
});

export const TextInput = ({
  value,
  onChange,
  placeholder = 'Enter your text here...',
  label = 'Text Input',
  multiline = true,
  error = false,
  helperText = '',
  errors = [],
  selectedError = null
}: TextInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  // Create highlighted text with markers
  const createHighlightedText = () => {
    if (!errors.length) return value;

    let result = value;
    const sortedErrors = [...errors].sort((a, b) => b.offset - a.offset);

    sortedErrors.forEach(err => {
      const before = result.slice(0, err.offset);
      const marked = result.slice(err.offset, err.offset + err.length);
      const after = result.slice(err.offset + err.length);
      const isSelected = selectedError && 
        selectedError.offset === err.offset && 
        selectedError.length === err.length;
      
      result = `${before}<mark class="${isSelected ? 'selected' : ''}" title="${err.message}">${marked}</mark>${after}`;
    });

    return result;
  };

  return (
    <TextFieldWrapper>
      <TextField
        fullWidth
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        label={label}
        multiline={multiline}
        variant="outlined"
        error={error}
        helperText={helperText}
        sx={{
          flex: 1,
          '& .MuiInputBase-root': {
            fontFamily: 'monospace',
            fontSize: '1rem',
            lineHeight: '1.5',
          }
        }}
      />
      <HighlightOverlay
        dangerouslySetInnerHTML={{ __html: createHighlightedText() }}
        style={{
          fontFamily: 'monospace',
          fontSize: '1rem',
          lineHeight: '1.5',
          padding: '16.5px 14px' // Match TextField padding
        }}
      />
    </TextFieldWrapper>
  );
};

export default TextInput; 