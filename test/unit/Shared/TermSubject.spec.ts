import {expect} from "chai";
import {TermSubject} from "../../../src/Shared/DataObjects/TermSubject";
import {Terms} from "../../../src/Shared/SharedData";

describe("TermSubject Test", function () {
    it("Should Save data", function () {
        let myTermSubject = new TermSubject();
        myTermSubject.term = Terms.T2018S;
        myTermSubject.subjects = ["CPSC"];
        let exportedData = myTermSubject.exportData();
        let newTermSubject = new TermSubject();
        newTermSubject.importData(JSON.parse(exportedData));
        expect(myTermSubject.term).equals(newTermSubject.term);
        expect(myTermSubject.subjects).to.deep.equals(newTermSubject.subjects);
    });
});
