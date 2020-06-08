P.hook('hObjectDisplay', function(response, object) {
    if(object.isKindOf(T.Person)) { return; }
    if(O.currentUser.can("update", object.ref)) {
        response.buttons["*CHANGELOG"] = [["/do/ts-object-changelog/changelog/"+object.ref.toString(), "Changelog"]]
    }
});