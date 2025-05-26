import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AppBar, Stack, Toolbar, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import TextInput from './components/TextField';
import IssuesList from './components/IssuesList';
import { useLanguageTool } from './hooks/useLanguageTool';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

interface TextError {
  message: string;
  offset: number;
  length: number;
  rule?: string;
  category?: string;
  replacements: Array<{ value: string }>;
}

function App() {
  const [text, setText] = useState('');
  const { errors, isLoading, error, checkTextGrammar } = useLanguageTool();
  const [selectedError, setSelectedError] = useState<TextError | null>(null);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (text) {
        checkTextGrammar(text);
      }
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [text, checkTextGrammar]);

  useEffect(() => {
    // Clear selected error when errors change
    setSelectedError(null);
  }, [errors]);

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const handleErrorSelect = (error: TextError) => {
    setSelectedError(selectedError?.offset === error.offset ? null : error);
  };

  const handleReplacementSelect = (replacement: string) => {
    if (selectedError) {
      const before = text.slice(0, selectedError.offset);
      const after = text.slice(selectedError.offset + selectedError.length);
      setText(before + replacement + after);
      setSelectedError(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        height: '100vh'
      }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Lango
            </Typography>
          </Toolbar>
        </AppBar>
        <Container 
          maxWidth="lg" 
          sx={{ 
            mt: 4,
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            height: 0
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to Lango
            </Typography>
            <Typography variant="body1" gutterBottom>
              A dead simple front-end for LanguageTool text analysis
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Stack 
            direction="row" 
            spacing={3} 
            sx={{ 
              flexGrow: 1,
              minHeight: 0,
              '& > *': {
                display: 'flex',
                flexDirection: 'column'
              }
            }}
          >
            <Box sx={{ 
              flex: '0 1 70%',
              minHeight: 0,
              display: 'flex'
            }}>
              <TextInput
                value={text}
                onChange={handleTextChange}
                label="Text to analyze"
                placeholder="Enter or paste your text here for grammar and style checking..."
                errors={errors}
                selectedError={selectedError}
              />
            </Box>
            <Box sx={{ 
              flex: '0 1 30%',
              minHeight: 0,
              display: 'flex'
            }}>
              <IssuesList 
                errors={errors}
                isLoading={isLoading}
                onErrorSelect={handleErrorSelect}
                selectedError={selectedError}
                onReplacementSelect={handleReplacementSelect}
              />
            </Box>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
