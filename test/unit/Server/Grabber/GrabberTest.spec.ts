import {Grabber} from "../../../../src/Server/Grabber/Grabber";
import {Terms, CourseInfo, Section} from "../../../../src/Shared/SharedData";
import {expect} from 'chai'
import {HTMLFetchException} from "../../../../src/Exceptions/HTMLFetchException";
import {HTMLParseException} from "../../../../src/Exceptions/HTMLParseException";

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

        it("Should raise error when fail to fetch ", function () {
            return Grabber.getSubjects(Terms.T2019S).then( ()=> {
                expect.fail("Should not resolve")
            }).catch((err) => {
                expect(err).instanceOf(HTMLFetchException)
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
        const mockCourse = "CPSC 100";

        it("Return correct course URL", () => {
            expect(Grabber.getCourseURL(mockCourse)).equals('https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-course&dept=CPSC&course=100');
        });

        it("Return all sections of the course", () => {
            return Grabber.getCourse(mockCourse).then((data) => {
                expect(data.subject).equals('CPSC');
                expect(data.course_id).equals('100');
                expect(data.sections[0].section_id).equals('101');
                expect(data.sections[0].activity_type).equals('Lecture');
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
    describe("Fetch Course In Session", () => {
        const mockCourse = "CPSC 100";

        it("Return correct course URL", () => {
            expect(Grabber.getCourseInSessionURL(mockCourse, Terms.T2019W)).equals('https://courses.students.ubc.ca/cs/courseschedule?sesscd=W&pname=subjectarea&tname=subj-course&course=100&sessyr=2019&dept=CPSC');
        });

        it("Return Exception when term is not defined", () => {
            return Grabber.getCourseInSession(mockCourse, undefined).then(() => {
                () => expect.fail('Should not resolve')
            }).catch(e => expect(e).instanceOf(HTMLFetchException));
        });

        it("Return all sections of the course in sepcific term", () => {
            return Grabber.getCourseInSession(mockCourse, Terms.T2019W).then((data) => {
                expect(data.subject).equals('CPSC');
                expect(data.course_id).equals('100');
                expect(data.term).equals(Terms.T2019W);
                expect(data.sections[0].section_id).equals('101');
                expect(data.sections[0].activity_type).equals('Lecture');
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
