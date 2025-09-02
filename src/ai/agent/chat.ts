import {LlmModel} from "@app/ai/enums/llm-model";
import ollama, {ChatResponse, Message} from "ollama";

interface IChatOptions {
    systemPrompt: string;
    userPrompt: string;
    model?: LlmModel;
    format?: object | string;
    temperature?: number;
}

export async function chat(options: IChatOptions): Promise<ChatResponse> {
    const {
        systemPrompt,
        userPrompt,
        model = LlmModel.LLAMA3_1_8B,
        format,
        temperature = 0,
    } = options;

    const messages: Message[] = [
        {
            role: 'system',
            content: systemPrompt
        },
        {
            role: 'user',
            content: userPrompt
        }
    ]

    return await ollama.chat({
        model,
        messages,
        format,
        options: {
            temperature
        }
    });
}