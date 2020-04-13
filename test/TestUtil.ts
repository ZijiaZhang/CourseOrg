import * as fs from "fs";

export function deleteTestDataFile(fileName: string) {
    if (fs.existsSync(`./data/test/${fileName}`)){
        fs.unlinkSync(`./data/test/${fileName}`);
    }
}

export function setTestFileContent(fileName:string, fileContent: string) {
    if(fs.existsSync(`./data/test/${fileName}`)){
        fs.writeFileSync(`./data/test/${fileName}`, fileContent);
    }
}
