import { readFileSync } from "fs"
import Handlebars from "handlebars"
import path from "path"

const pathToSource = path.join(import.meta.dirname, 'generatePageObjectModelPrompt.hbs');
const source = readFileSync(pathToSource, { encoding: "utf8" });
export const generatePageObjectModelPromptTemplate = Handlebars.compile(source);

export const generatePageObjectModelPrompt = (options: GeneratePageObjectModelPromptOptions) => {
    return generatePageObjectModelPromptTemplate(options);
}

export type GeneratePageObjectModelPromptOptions = {
    htmlContent: string;
}
