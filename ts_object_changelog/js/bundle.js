(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectDiffer = void 0;
var ObjectDiffer = /** @class */ (function () {
    function ObjectDiffer(a, b) {
        this.a = a;
        this.b = b;
    }
    ObjectDiffer.prototype.getChanges = function () {
        var added = this.getAdded();
        var removed = this.getRemoved();
        return added.concat(removed);
    };
    ObjectDiffer.prototype.getAdded = function () {
        var _this = this;
        var changes = [];
        this.b.each(function (v, d, q) {
            if (!_this.a.has(v, d, q)) {
                changes.push(_this.makeChangesObject("attribute", true, v, d, q));
            }
        });
        return changes;
    };
    ObjectDiffer.prototype.getRemoved = function () {
        var _this = this;
        var changes = [];
        this.a.each(function (v, d, q) {
            if (!_this.b.has(v, d, q)) {
                changes.push(_this.makeChangesObject("attribute", false, v, d, q));
            }
        });
        return changes;
    };
    ObjectDiffer.prototype.makeChangesObject = function (kind, added, v, d, q) {
        var valueString;
        if (O.isRef(v)) {
            valueString = v.load().title;
        }
        else {
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
    };
    return ObjectDiffer;
}());
exports.ObjectDiffer = ObjectDiffer;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectDiffer_1 = require("./ObjectDiffer");
// import { getAndIncreaseViewCountForRef } from './viewcount'
require("./ui");
P.respond("GET", "/do/ts-object-changelog/changelog", [
    { pathElement: 0, as: "object" },
], function (E, object) {
    if (!O.currentUser.can("create", object.ref)) {
        O.stop();
    }
    var changelog = [];
    changelog.push({
        datetime: object.creationDate,
        user: object.creationUid,
        action: "create"
    });
    // const viewCount = getAndIncreaseViewCountForRef(object.ref);
    var allObjects = object.history.concat(object);
    if (object.history.length > 1) {
        _.each(allObjects, function (obj, index) {
            if (index === 0) {
                return;
            }
            var prev = object.history[index - 1];
            var changes = new ObjectDiffer_1.ObjectDiffer(prev, obj).getChanges();
            changelog.push({
                datetime: obj.lastModificationDate,
                user: obj.lastModificationUid ? O.user(obj.lastModificationUid) : undefined,
                action: "update",
                changes: changes
            });
        });
    }
    changelog.reverse();
    E.render({
        object: object,
        // viewCount: viewCount,
        changelog: changelog
    });
});
P.globalTemplateFunction("object_changelog:attribute_name", function (attribute) {
    var attrInfo = SCHEMA.getAttributeInfo(attribute);
    if (attrInfo) {
        return attrInfo.name;
    }
});

},{"./ObjectDiffer":1,"./ui":3}],3:[function(require,module,exports){
P.hook('hObjectDisplay', function (response, object) {
    // response.buttons["#EDIT"] = [["test" + object.ref.toString(), "Test"]];
    if (object.isKindOf(T.Person)) {
        return;
    }
    if (O.currentUser.can("update", object.ref)) {
        response.buttons["*CHANGELOG"] = [["/do/ts-object-changelog/changelog/" + object.ref.toString(), "Changelog"]];
    }
});

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ0cy9PYmplY3REaWZmZXIudHMiLCJ0cy9pbmRleC50cyIsInRzL3VpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDVUE7SUFJSSxzQkFBWSxDQUFvQixFQUFFLENBQW9CO1FBQ2xELElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixDQUFDO0lBRUQsaUNBQVUsR0FBVjtRQUNJLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5QixJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEMsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFTywrQkFBUSxHQUFoQjtRQUFBLGlCQVFDO1FBUEcsSUFBTSxPQUFPLEdBQWMsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxLQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUN0QixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNsRTtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVPLGlDQUFVLEdBQWxCO1FBQUEsaUJBUUM7UUFQRyxJQUFNLE9BQU8sR0FBYyxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVB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O0lBQ0QsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDTCxNQUFNLEVBQUUsTUFBTTtRQUNkLHdCQUF3QjtRQUN4QixTQUFTLEVBQUUsU0FBUztLQUN2QixDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQztBQUVILENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxpQ0FBaUMsRUFBRSxVQUFTLFNBQWlCO0lBQ2xGLElBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwRCxJQUFHLFFBQVEsRUFBRTtRQUFFLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztLQUFFO0FBQzFDLENBQUMsQ0FBQyxDQUFDOzs7QUN6Q0gsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxVQUFTLFFBQVEsRUFBRSxNQUFNO0lBQzlDLDBFQUEwRTtJQUMxRSxJQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQUUsT0FBTztLQUFFO0lBQ3pDLElBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN4QyxRQUFRLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxvQ0FBb0MsR0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUE7S0FDL0c7QUFDTCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlxuaW50ZXJmYWNlIENoYW5nZXMge1xuICAgIGtpbmQ6IHN0cmluZyxcbiAgICBhdHRyaWJ1dGU6IG51bWJlcixcbiAgICBhZGRlZD86IGJvb2xlYW4sXG4gICAgcmVtb3ZlZD86IGJvb2xlYW4sXG4gICAgdmFsdWU6IGFueSxcbiAgICB2YWx1ZVN0cmluZzogc3RyaW5nXG59XG5cbmV4cG9ydCBjbGFzcyBPYmplY3REaWZmZXIge1xuICAgIGE6IEhhcGxvLlN0b3JlT2JqZWN0O1xuICAgIGI6IEhhcGxvLlN0b3JlT2JqZWN0O1xuXG4gICAgY29uc3RydWN0b3IoYTogSGFwbG8uU3RvcmVPYmplY3QsIGI6IEhhcGxvLlN0b3JlT2JqZWN0KSB7XG4gICAgICAgIHRoaXMuYSA9IGE7XG4gICAgICAgIHRoaXMuYiA9IGI7XG4gICAgfVxuXG4gICAgZ2V0Q2hhbmdlcygpOiBDaGFuZ2VzW10ge1xuICAgICAgICBjb25zdCBhZGRlZCA9IHRoaXMuZ2V0QWRkZWQoKTtcbiAgICAgICAgY29uc3QgcmVtb3ZlZCA9IHRoaXMuZ2V0UmVtb3ZlZCgpO1xuICAgICAgICByZXR1cm4gYWRkZWQuY29uY2F0KHJlbW92ZWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0QWRkZWQoKTogQ2hhbmdlc1tdIHtcbiAgICAgICAgY29uc3QgY2hhbmdlczogQ2hhbmdlc1tdID0gW107XG4gICAgICAgIHRoaXMuYi5lYWNoKCh2LCBkLCBxKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYS5oYXModiwgZCwgcSkpIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VzLnB1c2godGhpcy5tYWtlQ2hhbmdlc09iamVjdChcImF0dHJpYnV0ZVwiLCB0cnVlLCB2LGQscSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNoYW5nZXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRSZW1vdmVkKCk6IENoYW5nZXNbXSB7XG4gICAgICAgIGNvbnN0IGNoYW5nZXM6IENoYW5nZXNbXSA9IFtdO1xuICAgICAgICB0aGlzLmEuZWFjaCgodiwgZCwgcSkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmIuaGFzKHYsIGQsIHEpKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoKHRoaXMubWFrZUNoYW5nZXNPYmplY3QoXCJhdHRyaWJ1dGVcIiwgZmFsc2UsIHYsIGQsIHEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjaGFuZ2VzO1xuICAgIH1cblxuICAgIHByaXZhdGUgbWFrZUNoYW5nZXNPYmplY3Qoa2luZDogc3RyaW5nLCBhZGRlZDogYm9vbGVhbiwgdjogYW55LCBkOiBudW1iZXIsIHE6IG51bWJlcik6IENoYW5nZXMge1xuICAgICAgICBsZXQgdmFsdWVTdHJpbmc6IHN0cmluZztcbiAgICAgICAgaWYoTy5pc1JlZih2KSkge1xuICAgICAgICAgICAgdmFsdWVTdHJpbmcgPSB2LmxvYWQoKS50aXRsZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlU3RyaW5nID0gdi50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBraW5kOiBcImF0dHJpYnV0ZVwiLFxuICAgICAgICAgICAgYXR0cmlidXRlOiBkLFxuICAgICAgICAgICAgdmFsdWU6IHYudG9TdHJpbmcoKSxcbiAgICAgICAgICAgIHZhbHVlU3RyaW5nOiB2YWx1ZVN0cmluZyxcbiAgICAgICAgICAgIGFkZGVkOiBhZGRlZCxcbiAgICAgICAgICAgIHJlbW92ZWQ6ICFhZGRlZFxuICAgICAgICB9O1xuICAgIH1cbn0iLCJcbmltcG9ydCB7IE9iamVjdERpZmZlciBhcyBEaWZmZXIgfSBmcm9tICcuL09iamVjdERpZmZlcic7XG4vLyBpbXBvcnQgeyBnZXRBbmRJbmNyZWFzZVZpZXdDb3VudEZvclJlZiB9IGZyb20gJy4vdmlld2NvdW50J1xuaW1wb3J0ICcuL3VpJztcblxuUC5yZXNwb25kKFwiR0VUXCIsIFwiL2RvL3RzLW9iamVjdC1jaGFuZ2Vsb2cvY2hhbmdlbG9nXCIsIFtcbiAgICB7cGF0aEVsZW1lbnQ6IDAsIGFzOlwib2JqZWN0XCJ9LFxuXSwgZnVuY3Rpb24oRSwgb2JqZWN0OiBIYXBsby5TdG9yZU9iamVjdCkge1xuICAgIGlmKCFPLmN1cnJlbnRVc2VyLmNhbihcImNyZWF0ZVwiLCBvYmplY3QucmVmKSkgeyBPLnN0b3AoKTsgfVxuICAgIGNvbnN0IGNoYW5nZWxvZyA9IFtdO1xuICAgIGNoYW5nZWxvZy5wdXNoKHtcbiAgICAgICAgZGF0ZXRpbWU6IG9iamVjdC5jcmVhdGlvbkRhdGUsXG4gICAgICAgIHVzZXI6IG9iamVjdC5jcmVhdGlvblVpZCxcbiAgICAgICAgYWN0aW9uOiBcImNyZWF0ZVwiXG4gICAgfSlcbiAgICAvLyBjb25zdCB2aWV3Q291bnQgPSBnZXRBbmRJbmNyZWFzZVZpZXdDb3VudEZvclJlZihvYmplY3QucmVmKTtcbiAgICBjb25zdCBhbGxPYmplY3RzID0gb2JqZWN0Lmhpc3RvcnkuY29uY2F0KG9iamVjdCk7XG4gICAgaWYob2JqZWN0Lmhpc3RvcnkubGVuZ3RoID4gMSkge1xuICAgICAgICBfLmVhY2goYWxsT2JqZWN0cywgKG9iaiwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmKGluZGV4ID09PSAwKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgY29uc3QgcHJldiA9IG9iamVjdC5oaXN0b3J5W2luZGV4LTFdO1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlcyA9IG5ldyBEaWZmZXIocHJldiwgb2JqKS5nZXRDaGFuZ2VzKCk7XG4gICAgICAgICAgICBjaGFuZ2Vsb2cucHVzaCh7XG4gICAgICAgICAgICAgICAgZGF0ZXRpbWU6IG9iai5sYXN0TW9kaWZpY2F0aW9uRGF0ZSxcbiAgICAgICAgICAgICAgICB1c2VyOiBvYmoubGFzdE1vZGlmaWNhdGlvblVpZCA/IE8udXNlcihvYmoubGFzdE1vZGlmaWNhdGlvblVpZCkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgYWN0aW9uOiBcInVwZGF0ZVwiLFxuICAgICAgICAgICAgICAgIGNoYW5nZXM6IGNoYW5nZXNcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjaGFuZ2Vsb2cucmV2ZXJzZSgpO1xuICAgIEUucmVuZGVyKHtcbiAgICAgICAgb2JqZWN0OiBvYmplY3QsXG4gICAgICAgIC8vIHZpZXdDb3VudDogdmlld0NvdW50LFxuICAgICAgICBjaGFuZ2Vsb2c6IGNoYW5nZWxvZ1xuICAgIH0pO1xufSk7XG5cblAuZ2xvYmFsVGVtcGxhdGVGdW5jdGlvbihcIm9iamVjdF9jaGFuZ2Vsb2c6YXR0cmlidXRlX25hbWVcIiwgZnVuY3Rpb24oYXR0cmlidXRlOiBudW1iZXIpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGF0dHJJbmZvID0gU0NIRU1BLmdldEF0dHJpYnV0ZUluZm8oYXR0cmlidXRlKTtcbiAgICBpZihhdHRySW5mbykgeyByZXR1cm4gYXR0ckluZm8ubmFtZTsgfVxufSk7IiwiUC5ob29rKCdoT2JqZWN0RGlzcGxheScsIGZ1bmN0aW9uKHJlc3BvbnNlLCBvYmplY3QpIHtcbiAgICAvLyByZXNwb25zZS5idXR0b25zW1wiI0VESVRcIl0gPSBbW1widGVzdFwiICsgb2JqZWN0LnJlZi50b1N0cmluZygpLCBcIlRlc3RcIl1dO1xuICAgIGlmKG9iamVjdC5pc0tpbmRPZihULlBlcnNvbikpIHsgcmV0dXJuOyB9XG4gICAgaWYoTy5jdXJyZW50VXNlci5jYW4oXCJ1cGRhdGVcIiwgb2JqZWN0LnJlZikpIHtcbiAgICAgICAgcmVzcG9uc2UuYnV0dG9uc1tcIipDSEFOR0VMT0dcIl0gPSBbW1wiL2RvL3RzLW9iamVjdC1jaGFuZ2Vsb2cvY2hhbmdlbG9nL1wiK29iamVjdC5yZWYudG9TdHJpbmcoKSwgXCJDaGFuZ2Vsb2dcIl1dXG4gICAgfVxufSk7Il19
