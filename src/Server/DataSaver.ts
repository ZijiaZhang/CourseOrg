import * as fs from "fs";
import {Base} from "../Shared/DataObjects/Base";
import {FileReadException} from "../Exceptions/FileReadException";
import {FileWriteException} from "../Exceptions/FileWriteException";


export class DataSaver{
    public static saveData(data: string, fileName: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                resolve(fs.writeFileSync(`./data/${fileName}`, data));
            } catch (e) {
                reject(new FileWriteException(fileName))
            }
        })
    }

    public static loadJsonData<T extends Base>(fileName: string, dataType:  new() =>  T ): Promise<T>{
        return new Promise<T>( (resolve, reject) => {
            try{
                let fileContent = fs.readFileSync(`./data/${fileName}`).toString();
                let fileData = JSON.parse(fileContent);
                let data = new dataType();
                data.importData(fileData);
                return resolve(data);
            }catch(e){
                return reject(new FileReadException(fileName))
            }
        });
    }
}

export enum FileNames {
    TermSubjects = "TermSubject.json",
    SubjectCourse = "SubjectCourse.json"
}
