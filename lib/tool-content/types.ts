export type ToolExample = {
  title: string;
  input: string;
  output?: string;
  note?: string;
};

/** Educational content rendered below a tool. Must describe what the tool actually does. */
export type ToolContent = {
  about: string[];
  howTo: string[];
  examples: ToolExample[];
  commonErrors: { error: string; fix: string }[];
  limitations?: string[];
  faq?: { question: string; answer: string }[];
};

export type ContentMap = Record<string, ToolContent>;
