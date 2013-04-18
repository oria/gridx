define([
    'dojo/dom-geometry',
    'dojo/_base/query',
    'dojo/_base/array',
    '../GTest'
], function(domGeo, query, array, GTest){
    GTest.actionCheckers.push(
    {
        id: 122,
        name: 'Header cell and body cell must be aligned during horizontal scrolling',
        condition: function(grid){
            return grid.hScrollerNode.style.display !== 'none';
        },
        action: function(grid, doh, done){
            grid.hScrollerNode.scrollLeft = (grid.hScrollerNode.scrollLeft + grid.hScrollerNode.scrollWidth) / 2;
            setTimeout(function(){
                try{
                    query('.gridxCell', grid.headerNode).forEach(function(hc, i){
                       var x = domGeo.position(hc, true).x;
                       
                       array.forEach(grid.bodyNode.childNodes, function(row){
                            var cellX = domGeo.position(query('.gridxCell', row)[i], true).x;
                            doh.is(x, cellX);
                        });
                        
                    });
                    done.callback();
                }catch(e){
                    // console.log(e);
                    done.errback(e);
                }
            }, 100);
        }
    });
});
