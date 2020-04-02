import {Grabber} from "../../../../src/Server/Grabber/Grabber";
import {Terms, CourseInfo} from "../../../../src/Shared/SharedData";
import {expect} from 'chai'
import {HTMLParseException} from '../../../../src/Exceptions';

describe("GrabberTest", function () {
    describe("Fetch term", () => {
        it("Should return the correct Term URL", function () {
            expect(Grabber.getTermURL(Terms.T2020S)).equals('https://courses.students.ubc.ca/cs/courseschedule?sesscd=S&tname=subj-all-departments&sessyr=2020&pname=subjarea')
        });

        it("Should get all Subjects", function () {
            return Grabber.getSubjects(Terms.T2020S).then( (data)=> {
                expect(data.length).equals(262);
                expect(data).contains('CPSC');
            });
        });

        it("Should reject if parsing fails", function () {
            return Grabber.getSubjectsFromData('InvalidHTML').then(
                () => expect.fail("Should not resolve")
            ).catch(
                (err) => expect(err).instanceOf(HTMLParseException)
            );
        });
    });

    describe("Fetch Course", () => {
        it("Return correct course URL", () => {
            const course: CourseInfo = {
                subject: "CPSC",
                course_id: "100"
            };
            expect(Grabber.getCourseURL(course)).equals('https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept=CPSC&course=100');
        });

        it("Return all sections of the course", () => {
             const course: CourseInfo = {
                subject: "CPSC",
                course_id: "100"
            };
            return Grabber.getCourse(course).then((data) => {
                expect(data.length).equals(45);
                expect(data).contains('CPSC 100 101');
            })
        });

        it("Reject if fail", () => {
            return Grabber.getCourseFromData('InvalidHTML').then(
                () => expect.fail('Should not resolve')
            ).catch(
                (error) => expect(error).instanceOf(HTMLParseException)
            )
        });
    });
});
