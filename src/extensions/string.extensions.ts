declare global {
    interface String {
        ellipsis(length?: number): string;
    }
}

if (!String.prototype.ellipsis) {
    String.prototype.ellipsis = function (this: string, length = 0) {
        if (this.length > length) return this.substring(0, length - 1) + "..";
        else return this;
    };
}

export {};
