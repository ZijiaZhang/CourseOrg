import {Grabber} from "../../../../src/Server/Grabber/Grabber";
import {Terms} from "../../../../src/Shared/SharedData";
import {expect} from 'chai'
import {HTMLParseException} from '../../../../src/Exceptions';

describe("GrabberTest", function () {


    it("Should return the correct URL", function () {
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
            ()=> expect.fail("Should not resolve")
        ).catch(
            (err) => expect(err).instanceOf(HTMLParseException)
        );
    });
});
