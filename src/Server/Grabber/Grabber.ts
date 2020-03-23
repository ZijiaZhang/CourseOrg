/****** This Grabber will grab courses info from websites ******/
import {Terms} from "../../Shared/SharedData";
import fetch from 'node-fetch';
import {Response} from "node-fetch";

import {parse, HTMLElement} from 'node-html-parser';
import {HTMLParseException} from "../../Exceptions";

export class Grabber {
    constructor(){

    }

    public static getSubjects(term: Terms): Promise<string[]>{
        return new Promise<string[]>((resolve) => {
            fetch(Grabber.getTermURL(term)).then(
                (data: Response) =>
                    data.text().then(
                        (text) =>
                            Grabber.getSubjectsFromData(text).then(
                                (result) =>
                                    resolve(result))
            )).catch(()=> {
                
            });
        });
    }

    public static getTermURL(term: Terms): string{
        let cd = term.slice(term.length-1);
        let yr = term.slice(0, term.length-1);
        return `https://courses.students.ubc.ca/cs/courseschedule?sesscd=${cd}&tname=subj-all-departments&sessyr=${yr}&pname=subjarea`
    }

    public static getSubjectsFromData(text: string): Promise<string[]> {
        let root = parse(text) as HTMLElement;
        return new Promise((resolve, reject) =>{
            let table = root.querySelector("#mainTable");
            if (table !== null) {
                let deptElements = table.querySelectorAll('tr');
                let deptTexts = deptElements.map((elem) => elem.querySelector('td a'));
                let texts = deptTexts
                    .filter((elem) => elem instanceof HTMLElement)
                    .map((elem) => elem.childNodes[0].rawText);
                return resolve(texts);
            }
            return reject(new HTMLParseException());
        });
    }
}