import {expect} from "chai";
import {SubjectCourses} from "../../../src/Shared/DataObjects/SubjectCourses";

describe("SubjectCourse Test", function () {
    it("Should Save data", function () {
        let myTermSubject = new SubjectCourses();
        myTermSubject.subject = "CPSC";
        myTermSubject.courses = [{subject: "CPSC", course_id: "110"}];
        let exportedData = myTermSubject.exportData();
        let newTermSubject = new SubjectCourses();
        newTermSubject.importData(JSON.parse(exportedData));
        expect(myTermSubject.subject).equals(newTermSubject.subject);
        expect(myTermSubject.courses).to.deep.equals(newTermSubject.courses);
    });
});
