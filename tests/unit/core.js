define(['chai/chai'], function(chai){
	var assert = chai.assert;

	console.log('in core .js ');
	describe('Array', function(){
		before(function(){
			console.log('in case before');
		});

		describe('#indexOf()', function(){
			it('should return -1 when not present', function(){
				assert.equal([1,2,3].indexOf(4), -1);
			});
		});
	});
});