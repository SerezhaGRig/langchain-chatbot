import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { BaseMessage } from '@langchain/core/messages';

const searchTool = new DynamicStructuredTool({
  name: 'search',
  description:
    'Use to fetch current information and retrieve other information.',
  schema: z.object({
    query: z.string().describe('The info to use in response'),
  }),
  func: async ({}: { query: string }) => {
    // This is a placeholder for the actual implementation
    return 'In New York now -14 F';
  },
});

export const tools = [searchTool];

export const toolNode = new ToolNode<{ messages: BaseMessage[] }>(tools);
