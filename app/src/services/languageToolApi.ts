import axios from 'axios';

const API_URL = 'https://api.languagetoolplus.com/v2';

interface Match {
  message: string;
  shortMessage?: string;
  offset: number;
  length: number;
  replacements: Array<{ value: string }>;
  context: {
    text: string;
    offset: number;
    length: number;
  };
  sentence: string;
  rule: {
    id: string;
    description: string;
    issueType?: string;
    category: {
      id: string;
      name: string;
    };
  };
}

interface CheckResponse {
  software: {
    name: string;
    version: string;
    buildDate: string;
    apiVersion: number;
    premium?: boolean;
    status?: string;
  };
  language: {
    name: string;
    code: string;
    detectedLanguage: {
      name: string;
      code: string;
    };
  };
  matches: Match[];
}

interface CheckParams {
  text: string;
  language: string;
}

export const checkText = async ({ text, language }: CheckParams): Promise<CheckResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('text', text);
    params.append('language', language);

    const response = await axios.post<CheckResponse>(`${API_URL}/check`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`LanguageTool API error: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}; 