import {DataManager} from "../../src/Server/DataManager";
import {Terms} from "../../src/Shared/SharedData";
import {expect} from "chai";
import * as fs from "fs"
import {deleteTestDataFile} from "../TestUtil";

describe("Scheduler Test", function () {
    it("Should Fetch Data", () => {
        return DataManager.initializeCoreData(Terms.T2020S, 'test/test_initialize.json')
            .then(() => {
                expect(fs.existsSync('./data/test/test_initialize.json')).equals(true);
                deleteTestDataFile('test_initialize.json');
            })
            .catch((e) => {
                deleteTestDataFile('test_initialize.json');
                expect.fail(e);
            })

    })
});
