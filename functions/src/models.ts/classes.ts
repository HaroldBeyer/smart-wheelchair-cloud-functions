export class Occurence {
    day: Date;
    hour: string;
    location: Location;

    constructor(day: Date, hour: string, location: Location) {
        this.day = day;
        this.hour = hour;
        this.location = location;
    }
}

export class Location {
    ln: string | number;
    lt: string | number;

    constructor(ln: string | number, lt: string | number) {
        this.ln = ln;
        this.lt = lt;
    }
}