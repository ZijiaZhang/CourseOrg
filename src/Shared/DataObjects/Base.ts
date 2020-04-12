export class Base {
    public exportData(): string {
        return JSON.stringify(this)
    }
    public importData(file: any): void{
        return
    };

}
