(function (exports) {
    "use strict";

    /*jshint curly:false */
    /*global d3 */

    exports.dendrogram = function () {

        var dendrogram, width, height, labels, cluster, diagonal;

        width = 300;
        height = 600;

     // The labels of the initial observations.
        labels = [];

     // Create cluster layout.
        cluster = d3.layout.cluster();

        diagonal = d3.svg.diagonal()
                     .projection(function (d) {
                         return [d.y, d.x];
                      });

        dendrogram = function (selection) {

            selection.each(function (data) {

                var svg, group, nodes, link, node;

             // Select existing SVG elements.
                svg = d3.select(this)
                        .selectAll("svg")
                        .data([data]) // Trick to create only one svg element for each data set.

             // Create non-existing SVG elements.
                svg.enter()
                   .append("svg");

             // Update both existing and newly created SVG elements.
                svg.attr("width", width)
                   .attr("height", height);

                group = svg.append("g")
                           .attr("transform", "translate(40, 0)");

                cluster.size([height, width - 160]);

                nodes = cluster.nodes(data[0]);

                link = group.selectAll("path.link")
                            .data(cluster.links(nodes))
                            .enter()
                            .append("path")
                            .attr("class", "link")
                            .attr("d", diagonal);

                node = group.selectAll("g.node")
                            .data(nodes)
                            .enter()
                            .append("g")
                            .attr("class", "node")
                            .attr("transform", function (d) {
                                return "translate(" + d.y + "," + d.x + ")";
                             });

                node.append("circle")
                    .attr("r", 4.5);

                node.append("text")
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
