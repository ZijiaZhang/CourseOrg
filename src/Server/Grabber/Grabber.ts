/****** This Grabber will grab courses info from websites ******/
import {Terms, CourseInfo, Section} from "../../Shared/SharedData";
import fetch from 'node-fetch';
import {Response} from "node-fetch";

import {parse, HTMLElement} from 'node-html-parser';
import {HTMLFetchException} from "../../Exceptions/HTMLFetchException";
import {HTMLParseException} from "../../Exceptions/HTMLParseException";

export class Grabber {

    public static getCourse(course: string): Promise<CourseInfo> {
        return new Promise<CourseInfo>((resolve, reject) => {
            fetch(Grabber.getCourseURL(course)).then(
                (data: Response) => {
                    if (data.status!==200) {
                        return reject(new HTMLFetchException())
                    }
                    data.text().then(
                        (text) =>
                            Grabber.getCourseFromData(text).then(
                                (result) => {
                                    console.log("result: " + result);
                                    resolve(result);
                                }
                                    
                            ).catch((err) => {
                                console.log("Course getting error:" + err);
                                reject(err);
                            })
                    )
                }
            ).catch((err) => {
                reject(err)
            });
        });
    }
 public static getCourseInSession(course: string, term: Terms): Promise<CourseInfo> {
        return new Promise<CourseInfo>((resolve, reject) => {
            fetch(Grabber.getCourseInSessionURL(course, term)).then(
                (data: Response) => {
                    if(data.status!==200) {
                        return reject(new HTMLFetchException())
                    }
                    data.text().then (
                        (text) =>
                            Grabber.getCourseFromData(text).then(
                                (result) => {
                                    const course = {
                                        ...result,
                                        term: term
                                    }
                                    resolve(course);
                                }
                                    
                            )
                    )
                }
            ).catch((err) => {
                reject(err)
            });
        });
    }

    public static getSubjects(term: Terms): Promise<string[]>{
        return new Promise<string[]>((resolve, reject) => {
            fetch(Grabber.getTermURL(term))
                .then(
                (data: Response) => {
                    if(data.status!==200) {
                        return reject(new HTMLFetchException())
                    }
                    return data.text().then(
                        (text) =>
                            Grabber.getSubjectsFromData(text).then(
                                (result) =>
                                    resolve(result)))
                })
                .catch((err)=> {
                reject(err)
            });
        });
    }

    public static getTermURL(term: Terms): string{
        let cd = term.slice(term.length-1);
        let yr = term.slice(0, term.length-1);
        return `https://courses.students.ubc.ca/cs/courseschedule?sesscd=${cd}&tname=subj-all-departments&sessyr=${yr}&pname=subjarea`
    }

    public static getCourseURL(course: string): string {
        const courseString = course.split(' ');
        let dept = courseString[0];
        let courseNum = courseString[1];
        return `https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept=${dept}&course=${courseNum}`;
    }
    public static getCourseInSessionURL(course: string, term: Terms): string {
        const courseString = course.split(' ');
        let dept = courseString[0];
        let courseNum = courseString[1];
        if (!term) {
            throw new HTMLFetchException('Fail to construct URL');
        }
        let cd = term.slice(term.length-1);
        let yr = term.slice(0, term.length-1);
        return `https://courses.students.ubc.ca/cs/courseschedule?sesscd=${cd}&pname=subjectarea&tname=subj-course&course=${courseNum}&sessyr=${yr}&dept=${dept}`;
        
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

    public static getCourseFromData(text: string): Promise<CourseInfo> {
        let root = parse(text) as HTMLElement;
        return new Promise((resolve, reject) => {
            let table = root.querySelector(".section-summary");
            if (table != null) {
                let courseTitle = root.querySelector('h4').text.split(' ');
                let course_subject = courseTitle[0];
                let course_num = courseTitle[1];
                Grabber.getSectionsFromData(text).then((data) => {
                        const course: CourseInfo = {
                                subject: course_subject,
                                course_id: course_num,
                                sections: data
                        };
                        // console.log(course);
                        return resolve(course);
                        // return course;
                    }
                ).catch((err) => {
                    console.log("Section fetching failure");
                });
                // resolve(course.then(data => resolve(data)));
            }
            return reject(new HTMLParseException());
        })
    }

    public static getSectionsFromData(text: string): Promise<Section[]> {
        console.log("Fetching section")
        let root = parse(text) as HTMLElement;
        return new Promise((resolve, reject) => {
            let table = root.querySelector(".section-summary");
            if (table != null) {
                let sectionElements = table.querySelectorAll('tr');
                sectionElements.shift();
                // console.log(sectionElements);
                // let sectionTexts = sectionElements.map((elem) => elem.querySelector('td a'));
                let sections = sectionElements.map((elem) => {
                    let sectionTextElement = elem.querySelector('td a');
                    if (!(sectionTextElement instanceof HTMLElement)) {
                        return;
                    }
                    let sectionId = sectionTextElement.text.split(' ')[2];
                    // console.log(sectionId);
                    let activityType = elem.querySelectorAll('td')[2].text;
                    // console.log(activityType);
                    return {
                        section_id: sectionId,
                        activity_type: activityType
                    }
                });
                resolve(sections);
            }
            return reject(new HTMLParseException());
        })
 
    }
}
