
import { ObjectDiffer as Differ } from './ObjectDiffer';
// import { getAndIncreaseViewCountForRef } from './viewcount'
import './ui';

P.respond("GET", "/do/ts-object-changelog/changelog", [
    {pathElement: 0, as:"object"},
], function(E, object: Haplo.StoreObject) {
    if(!O.currentUser.can("create", object.ref)) { O.stop(); }
    const changelog = [];
    changelog.push({
        datetime: object.creationDate,
        user: object.creationUid,
        action: "create"
    })
    // const viewCount = getAndIncreaseViewCountForRef(object.ref);
    const allObjects = object.history.concat(object);
    if(object.history.length > 1) {
        _.each(allObjects, (obj, index) => {
            if(index === 0) { return; }
            const prev = object.history[index-1];
            const changes = new Differ(prev, obj).getChanges();
            changelog.push({
                datetime: obj.lastModificationDate,
                user: obj.lastModificationUid ? O.user(obj.lastModificationUid) : undefined,
                action: "update",
                changes: changes
            })
        });
    }
    changelog.reverse();
    E.render({
        object: object,
        // viewCount: viewCount,
        changelog: changelog
    });
});

P.globalTemplateFunction("object_changelog:attribute_name", function(attribute: number): string | undefined {
    const attrInfo = SCHEMA.getAttributeInfo(attribute);
    if(attrInfo) { return attrInfo.name; }
});