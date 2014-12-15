/* global describe, it, require */

//define(['../shell'], function (Shell) {
    describe('Shell', function(){
        describe('#Constructor', function(){
            it('should create Shell object which is not undefined or null', function(){

                var s = require("");
                var shell = new Shell();

                shell.should.not.equal(undefined);
                shell.should.not.equal(null);

            });
        });
    });
//});
