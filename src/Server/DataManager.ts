import {TermSubject} from "../Shared/DataObjects/TermSubject";
import {Grabber} from "./Grabber/Grabber";
import {Terms} from "../Shared/SharedData";
import {DataSaver} from "./DataSaver";

export class DataManager {
    public static initializeCoreData(term: Terms, filename: string): Promise<TermSubject>{
        return new Promise((resolve, reject) => {
            Grabber.getSubjects(term).then((subjects) => {
                let subjectsOfTerm = new TermSubject();
                subjectsOfTerm.term = term;
                subjectsOfTerm.subjects = subjects;
                DataSaver.saveData(subjectsOfTerm.exportData(), filename).then(
                    () => {
                        resolve(subjectsOfTerm);
                    }
                ).catch((e) => reject(e));
            }).catch((e) => reject(e))
        })
    }
}
