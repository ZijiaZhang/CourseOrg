export class FileWriteException extends Error{
    constructor(file: string) {
        super(`Failed To read File ${file}`);
    }
}
