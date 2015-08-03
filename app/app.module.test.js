/*global describe, beforeEach, it, expect */
/*jshint expr: true */
(function() {
    "use strict";

    describe("pub-mobile-analytics module", function() {

        beforeEach(function() {
            this.module = angular.module("pub-mobile-analytics");
        });

        it("should be registered", function() {
            expect(this.module).not.to.equal(null);
        });
    });

}).call(this);
