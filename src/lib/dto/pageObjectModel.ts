export class PageObjectModel {
    constructor(
        public readonly fileName: string,
        public readonly content: string
    ) { }

    static fromObject(object: Record<string, string>): PageObjectModel {
        if (!object.fileName) throw new Error("Missing fileName in object.");
        if (!object.content) throw new Error("Missing contents in object.");

        return new PageObjectModel(object.fileName, object.content);
    }
}
