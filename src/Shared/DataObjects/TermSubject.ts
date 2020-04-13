import {Terms} from "../SharedData";
import {Base} from "./Base";

export class TermSubject extends Base{
    public term: Terms = null;
    public subjects: string[] = [];

    importData(file: any): void {
        this.term = file.term;
        this.subjects = file.subjects;
        super.importData(file);
    }
}
