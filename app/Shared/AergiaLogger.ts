export default class AergiaLogger {

    private _subsystem: string = 'aergia';

    constructor (subsystem: string) {
        this._subsystem = subsystem;
    }

    public info (...data: string[]) {
        console.info (`${ this._subsystem } > info >`, data);
    }

    public warn (...data: string[]) {
        console.info (`${ this._subsystem } > warning >`, data);
    }

    public error (...data: string[]) {
        console.info (`${ this._subsystem } > error >`, data);
    }

}
