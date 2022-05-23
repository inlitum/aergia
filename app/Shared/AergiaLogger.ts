export default class AergiaLogger {

    private _subsystem: string = 'aergia';

    constructor (subsystem: string) {
        this._subsystem = subsystem;
    }

    public info (...data: any[]) {
        console.info (`${ this._subsystem } > info >`, data);
    }

    public warn (...data: any[]) {
        console.warn (`${ this._subsystem } > warning >`, data);
    }

    public error (...data: any[]) {
        console.error (`${ this._subsystem } > error >`, data);
    }

}
