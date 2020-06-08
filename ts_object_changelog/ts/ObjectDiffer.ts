
interface Changes {
    kind: string,
    attribute: number,
    added?: boolean,
    removed?: boolean,
    value: any,
    valueString: string
}

export class ObjectDiffer {
    a: Haplo.StoreObject;
    b: Haplo.StoreObject;

    constructor(a: Haplo.StoreObject, b: Haplo.StoreObject) {
        this.a = a;
        this.b = b;
    }

    getChanges(): Changes[] {
        const added = this.getAdded();
        const removed = this.getRemoved();
        return added.concat(removed);
    }

    private getAdded(): Changes[] {
        const changes: Changes[] = [];
        this.b.each((v, d, q) => {
            if (!this.a.has(v, d, q)) {
                changes.push(this.makeChangesObject("attribute", true, v,d,q));
            }
        });
        return changes;
    }

    private getRemoved(): Changes[] {
        const changes: Changes[] = [];
        this.a.each((v, d, q) => {
            if (!this.b.has(v, d, q)) {
                changes.push(this.makeChangesObject("attribute", false, v, d, q));
            }
        });
        return changes;
    }

    private makeChangesObject(kind: string, added: boolean, v: any, d: number, q: number): Changes {
        let valueString: string;
        if(O.isRef(v)) {
            valueString = v.load().title;
        } else {
            valueString = v.toString();
        }
        return {
            kind: "attribute",
            attribute: d,
            value: v.toString(),
            valueString: valueString,
            added: added,
            removed: !added
        };
    }
}