export class FileReadException extends Error{
    constructor(file: string) {
        super(`Failed To read File ${file}`);
    }
}
