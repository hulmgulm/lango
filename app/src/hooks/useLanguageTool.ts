import { useState, useCallback } from 'react';
import { checkText } from '../services/languageToolApi';

interface TextError {
  message: string;
  offset: number;
  length: number;
  rule?: string;
  category?: string;
  replacements: Array<{ value: string }>;
}

interface UseLanguageToolResult {
  errors: TextError[];
  isLoading: boolean;
  error: string | null;
  checkTextGrammar: (text: string, language?: string) => Promise<void>;
}

export const useLanguageTool = (): UseLanguageToolResult => {
  const [errors, setErrors] = useState<TextError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkTextGrammar = useCallback(async (text: string, language: string = 'auto') => {
    if (!text.trim()) {
      setErrors([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Checking text:', { text: text.slice(0, 100), language });
      const response = await checkText({ text, language });
      console.log('API Response:', response);
      
      const formattedErrors: TextError[] = response.matches.map(match => ({
        message: match.message,
        offset: match.offset,
        length: match.length,
        rule: match.rule.id,
        category: match.rule.category.name,
        replacements: match.replacements
      }));

      setErrors(formattedErrors);
    } catch (err) {
      console.error('LanguageTool API Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while checking the text');
      setErrors([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    errors,
    isLoading,
    error,
    checkTextGrammar
  };
}; 