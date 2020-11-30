export class Occurence {
    day: string;
    hour: string;
    location: Location;

    constructor(day: string, hour: string, location: Location) {
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