(function (exports) {
    "use strict";

    /*jshint curly:false */
    /*global d3 */

    exports.dendrogram = function () {

        var dendrogram, width, height, labels, clusterLayout, elbow;

        width = 300;
        height = 600;

     // The labels of the initial observations.
        labels = [];

     // Create cluster layout.
        clusterLayout = d3.layout.cluster();

     // Taken from http://bl.ocks.org/2429963.
        elbow = function (d, i) {
            return "M" + d.source.y + "," + d.source.x + "V" + d.target.x + "H" + d.target.y;
        };

        dendrogram = function (selection) {

            selection.each(function (data) {

                var nodes, links, svg, dendrogram, edges, vertices, enterVertex;

                clusterLayout.size([height, width - 160]);
                nodes = clusterLayout.nodes(data[0]);
                links = clusterLayout.links(nodes);

             // Generate canvas.
                svg = d3.select(this)
                        .selectAll("svg")
                        .data([data]);

             // Generate chart template.
                svg.enter()
                   .append("svg")
                   .append("g")
                   .attr("id", "dendrogram")
                   .attr("transform", "translate(40, 0)");

             // Update dimensions.
                svg.attr("width", width)
                   .attr("height", height);

                dendrogram = d3.select("g#dendrogram");

             // Generate edges.
                edges = dendrogram.selectAll("path.link")
                                  .data(links);

                edges.enter()
                     .append("path")
                     .attr("class", "link");

                edges.attr("d", elbow);

                edges.exit()
                     .remove();

             // Until I figure out a way how to join correctly over changing elements,
             // I will just remove what is there first.
                dendrogram.selectAll("g.node")
                          .remove();

             // Generate vertices.
                vertices = dendrogram.selectAll("g.node")
                                     .data(nodes);

                enterVertex = vertices.enter()
                                      .append("g")
                                      .attr("class", "node");
                enterVertex.append("circle")
                           .attr("r", 4.5);
                enterVertex.append("text")
                        .attr("dx", function (d) {
                            return d.children ? -8 : 8;
                         })
                        .attr("dy", 3)
                        .attr("text-anchor", function (d) {
                            return d.children ? "end" : "start";
                         })
                        .text(function (d) {
                            return labels[d.label];
                         });

                vertices.attr("transform", function (d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            });

        };

        dendrogram.height = function (_) {
            if (!arguments.length) return height;
            height = _;
            return dendrogram;
        };

        dendrogram.width = function (_) {
            if (!arguments.length) return width;
            width = _;
            return dendrogram;
        };

        dendrogram.labels = function (_) {
            if (!arguments.length) return labels;
            labels = _;
            return dendrogram;
        };

        return dendrogram;

    };

}(window));
