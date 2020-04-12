import {expect} from "chai";
import {Base} from "../../../src/Shared/DataObjects/Base";
import {DataSaver} from "../../../src/Server/DataSaver";
import * as fs from "fs";
import {FileReadException} from "../../../src/Exceptions/FileReadException";
import {FileWriteException} from "../../../src/Exceptions/FileWriteException";

class TestData extends Base {
    a = 10;
    b = function () {
        return 10;
    };

    public importData(file: any): void {
        super.importData(file);
        this.a = Object.keys(file).includes("a") ? file.a : 10;
    }
}


describe("DataSaver Test", function () {
    it("Should Save data", function () {
       return DataSaver.saveData('Test', "test/test_data_save.txt").then(
           () => expect(fs.existsSync('./data/test/test_data_save.txt')).equals(true)
       ).catch(()=>{
           expect.fail()
       }).then(() => {
           if (fs.existsSync('./data/test/test_data_save.txt')){
               fs.unlinkSync('./data/test/test_data_save.txt')
           }
       })
    });

    it("Should Load Data Correctly", function () {
        return DataSaver.loadJsonData('test/test_data1.json', TestData).then((result) => {
            expect(result.a).equals(20);
            expect(result).instanceOf(TestData)
        }).catch(() => {
            expect.fail();
        })
    });

    it("Should Save & Load Data Correctly", function () {
        let testData = new TestData();
        testData.a = 30;
        return DataSaver.saveData(testData.exportData(), 'test/test_data2.json').then(() => {
            return DataSaver.loadJsonData('test/test_data2.json', TestData).then((result) => {
                expect(result.a).equals(30);
                expect(result).instanceOf(TestData)
            }).catch(() => {
                expect.fail();
            })
        }).catch(() => {
            expect.fail();
        });

    });

    it("Save fail", function () {
        return DataSaver.saveData('Test', "test123123/test_data_save.txt").then(
            () => expect.fail()
        ).catch((e)=>{
            expect(e).instanceOf(FileWriteException)
        })
    });

    it("Should Load Data Correctly", function () {
        return DataSaver.loadJsonData('test123123/test_data1.json', TestData).then(() => {
            expect.fail()
        }).catch((e) => {
            expect(e).instanceOf(FileReadException)
        })
    });
});
