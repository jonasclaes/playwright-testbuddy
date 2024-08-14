import { PageObjectModel } from "./dto/pageObjectModel.js";

export abstract class PageObjectModelGenerator {
    generateFromHtml(html: string): Promise<PageObjectModel[]> {
        throw new Error("Method not implemented.");
    }
}
