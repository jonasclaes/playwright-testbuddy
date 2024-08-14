import { PageObjectModel } from "./dto/pageObjectModel.js";
import { PageObjectModelGenerator } from "./pageObjectModelGenerator.js";
import Anthropic from "@anthropic-ai/sdk";
import { generatePageObjectModelPrompt } from "./prompt/generatePageObjectModelPrompt.js";

export class AnthropicPageObjectModelGenerator extends PageObjectModelGenerator {
    protected readonly anthropic: Anthropic;
    protected readonly model: string;

    constructor(readonly options: AnthropicPageObjectModelGeneratorOptions) {
        super();

        this.anthropic = new Anthropic({
            apiKey: options.apiKey,

        });

        this.model = options.model ?? "claude-3-5-sonnet-20240620";
    }

    async generateFromHtml(html: string): Promise<PageObjectModel[]> {
        const message = await this.anthropic.messages.create({
            model: this.model,
            max_tokens: 8192,
            temperature: 0,
            system: "You are a Playwright test automation expert tasked with creating Page Object Models (POMs) for given HTML content.",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: generatePageObjectModelPrompt({ htmlContent: html })
                        }
                    ]
                }
            ],
        }, {
            headers: {
                "anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15"
            }
        });

        if (message.content.length === 0) throw new Error("No content returned from AI inference.");

        const content = message.content[0];

        if (content.type !== "text") throw new Error("Wrong content type returned from AI inference.");

        const pageObjectModelsSource: Record<string, string>[] = JSON.parse(content.text);

        return pageObjectModelsSource.map(pageObjectModel => PageObjectModel.fromObject(pageObjectModel))
    }
}

export interface AnthropicPageObjectModelGeneratorOptions {
    apiKey: string;
    model?: string;
}
