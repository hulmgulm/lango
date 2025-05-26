import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Box, Chip, Stack } from '@mui/material';
import type { ReactNode } from 'react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

interface TextError {
  message: string;
  offset: number;
  length: number;
  rule?: string;
  category?: string;
  replacements: Array<{ value: string }>;
}

interface IssuesListProps {
  errors: TextError[];
  isLoading?: boolean;
  children?: ReactNode;
  onErrorSelect?: (error: TextError) => void;
  selectedError?: TextError | null;
  onReplacementSelect?: (replacement: string) => void;
}

export const IssuesList = ({ 
  errors = [], 
  isLoading = false,
  children,
  onErrorSelect,
  selectedError,
  onReplacementSelect
}: IssuesListProps) => {
  if (isLoading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: 1, overflow: 'hidden' }}>
          <Typography variant="body1">Analyzing text...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (errors.length === 0) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent 
          sx={{ 
            flex: 1, 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 3
          }}
        >
          <CheckCircleOutlineIcon 
            sx={{ 
              fontSize: 48, 
              color: 'success.main',
              mb: 2
            }} 
          />
          <Typography 
            variant="h6" 
            color="success.main"
            sx={{ 
              fontWeight: 500,
              mb: 1
            }}
          >
            Perfect!
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            No grammar or style issues found in your text.
          </Typography>
          {children}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: 2,
          overflow: 'hidden'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Found {errors.length} potential {errors.length === 1 ? 'issue' : 'issues'}
        </Typography>
        <Box sx={{ 
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <List sx={{ 
            flex: 1, 
            overflow: 'auto',
            '& > :last-child': {
              borderBottom: 'none'
            },
            pr: 1,
            mr: -1
          }}>
            {errors.map((error, index) => {
              const isSelected = selectedError && 
                selectedError.offset === error.offset && 
                selectedError.length === error.length;
                
              return (
                <Box key={`${error.offset}-${index}`}>
                  <ListItem 
                    sx={{
                      py: 0.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: isSelected ? 'action.selected' : 'transparent',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                    onClick={() => onErrorSelect?.(error)}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <FiberManualRecordIcon sx={{ fontSize: 8, color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={error.message}
                      secondary={error.category}
                      primaryTypographyProps={{
                        variant: 'body2',
                        sx: { fontWeight: 500 }
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                        sx: { color: 'text.secondary' }
                      }}
                    />
                  </ListItem>
                  {isSelected && error.replacements && error.replacements.length > 0 && (
                    <Box sx={{ px: 4, py: 1, backgroundColor: 'action.selected' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Suggested fixes:
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {error.replacements.map((replacement, idx) => (
                          <Chip
                            key={idx}
                            label={replacement.value}
                            size="small"
                            onClick={() => onReplacementSelect?.(replacement.value)}
                            icon={<AutoFixHighIcon />}
                            sx={{ 
                              backgroundColor: 'background.paper',
                              '&:hover': {
                                backgroundColor: 'background.default'
                              }
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>
              );
            })}
          </List>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

export default IssuesList; 