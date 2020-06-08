
interface ViewCountsRow extends Haplo.Database.Row {
    ref: Haplo.Ref,
    count: number
}

const viewCounts = P.db.table<ViewCountsRow>("viewCounts", {
    ref: { type: "ref" },
    count: { type: "int" }
});

const getCountForRef = (ref: Haplo.Ref): ViewCountsRow | undefined => {
    const r = viewCounts.select().where("ref", "=", ref);
    if(r.length) {
        return r[0];
    }
}

export const getAndIncreaseViewCountForRef = (ref: Haplo.Ref): number => {
    let row = getCountForRef(ref);
    if(!row) {
        row = viewCounts.create({
            ref: ref,
            count: 0
        });
    }
    row.count = row.count + 1;
    row.save();
    return row.count;
}

const otherFunction = (ref: Haplo.Ref): number | undefined => {
    let r = getCountForRef(ref);
    // if we don't check if(r): Object is possibly 'undefined'.
    if(r) { 
        return r.count+1;
    }
}