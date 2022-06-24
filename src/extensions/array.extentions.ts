declare global {
    interface Array<T> {
        first(): T;
        last(): T;
        chunkize(chunkSize: number): Array<Array<T>>;
    }
}

if (!Array.prototype.first) {
    Array.prototype.first = function <T>(this: Array<T>) {
        return this[0];
    };
}

if (!Array.prototype.last) {
    Array.prototype.last = function <T>(this: Array<T>) {
        return this[this.length - 1];
    };
}

if (!Array.prototype.chunkize) {
    Array.prototype.chunkize = function <T>(this: Array<T>, chunkSize: number) {
        const chunks: typeof this[] = [];

        for (let i = 0; i < this.length; i += chunkSize) {
            chunks.push(this.slice(i, i + chunkSize));
        }

        return chunks;
    };
}

export {};
