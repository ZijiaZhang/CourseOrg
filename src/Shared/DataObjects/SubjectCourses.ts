import {Base} from "./Base";
import {CourseInfo} from "../SharedData";

export class SubjectCourses extends Base{
    public subject: string = null;
    public courses: CourseInfo[] = null;

    importData(file: any): void {
        super.importData(file);
        this.subject = file.subject;
        this.courses =  file.courses;
    }
}
