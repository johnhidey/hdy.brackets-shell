/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true,
         indent: 4, maxerr: 50 */
/*global define */

define(function (require, exports, module) {
    "use strict";

    var Control = function(id) {

        this.children = [];
        this.id = id;

    };

    Control.prototype = {

        add: function (child) {

            this.children.push(child);

        },

        remove: function (child) {

            var length = this.children.length;
            for (var i = 0; i < length; i++) {
                if (this.children[i] === child) {
                    this.children.splice(i, 1);
                    return;
                }
            }
        },

        getChild: function (i) {
            return this.children[i];
        },

        hasChildren: function () {
            return this.children.length > 0;
        }
    };

    module.exports = Control;

});
