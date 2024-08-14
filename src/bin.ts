import "dotenv/config";
import { PageObjectModel } from "./lib/dto/pageObjectModel.js";
import { mkdir, readFile, stat, writeFile } from "fs/promises";
import path from "path";
import { AnthropicPageObjectModelGenerator } from "./lib/anthropicPageObjectModelGenerator.js";
import { existsSync } from "fs";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            [key: string]: string | undefined;
            TZ?: string | undefined;
            ANTHROPIC_API_KEY?: string | undefined;
        }
    }
}

const ensureDirectoryExists = async (directoryPath: string) => {
    const pathExists = existsSync(directoryPath);
    if (!pathExists) return await mkdir(directoryPath, { recursive: true });

    const stats = await stat(directoryPath);
    if (!stats.isDirectory()) throw new Error("Path already exists and is not a directory.");

    return directoryPath;
}

const main = async () => {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("Missing ANTHROPIC_API_KEY");

    const codeGenerator = new AnthropicPageObjectModelGenerator({
        apiKey: process.env.ANTHROPIC_API_KEY
    });

    // TODO: Replace with Playwright call to automatically fetch HTML content from a page. @jonasclaes
    const html = await readFile(path.join(import.meta.dirname, '..', 'example.html'), { encoding: "utf8" });

    const pageObjectModels: PageObjectModel[] = await codeGenerator.generateFromHtml(html);

    const currentWorkingDirectory = process.cwd();
    const outputDirectory = 'generated';
    await ensureDirectoryExists(path.join(currentWorkingDirectory, outputDirectory))

    for (const pageObjectModel of pageObjectModels) {
        console.log(`Writing ${pageObjectModel.fileName} to disk.`)
        const outputPath = path.join(currentWorkingDirectory, outputDirectory, pageObjectModel.fileName);
        await writeFile(outputPath, pageObjectModel.content, { encoding: "utf8" });
    }
}

await main();
