let svg = d3.select("body")
    .append("svg")
    .append("g");

let width = document.body.getBoundingClientRect().width;
let height = document.body.getBoundingClientRect().height;

let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => {
        return d.address;
    }))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2));

let link = svg
    .selectAll("line")
    .append("line");

let node = svg
    .selectAll("circle")
    .append("circle");

let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


function ticked() {
    link
        .attr("x1", function (d) {
            return d.source.x;
        })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });

    node
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        });
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

let chart = Object.assign(svg.node(), {
    update({nodes, links}) {

        // Make a shallow copy to protect against mutation, while
        // recycling old nodes to preserve position and velocity.
        const old = new Map(node.data().map(d => [d.address, d]));
        nodes = nodes.map(d => Object.assign(old.get(d.address) || {}, d));
        links = links.map(d => Object.assign({}, d));

        link = link
            .data(links, d => [d.source, d.target])
            .join("line").style("stroke", "#aaa");

        node = node
            .data(nodes, d => d.address)
            .join(enter => enter.append("circle")
                .attr("r", 5)
                .style("fill", "#69b3a2")
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended))
                .on('mouseover', d => {
                    d3.select(this).style('fill', '#000');
                    link.style('stroke', function (link_d) {
                        return link_d.source.address === d.address || link_d.target.address === d.address ? '#000' : '#aaa';
                    }).style('stroke-width', function (link_d) {
                        return link_d.source.address === d.address || link_d.target.address === d.address ? 2 : 1;
                    });

                    div.transition()
                        .duration(200)
                        .style("opacity", .9);

                    div.html("Tooltip")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on('mouseout', d => {
                    node.style('fill', "#69b3a2");
                    link.style('stroke', '#aaa')
                        .style('stroke-width', '1');

                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                }));

        simulation.nodes(nodes).on("tick", ticked);
        simulation.force("link").links(links);
        simulation.alpha(1).restart();
    }
});


function parseData(data) {
    data.sentinels = [];

    Object.keys(data.entities.sentinels.data).forEach(sentinel => {
        data.sentinels.push(data.entities.sentinels.data[sentinel]);
    });

    data.links = [];

    Object.keys(data.entities.networkLinks.data).forEach(link => {
        data.links.push(data.entities.networkLinks.data[link]);
    });

    delete data.entities;
}


d3.json("./data.json").then((data) => {
    parseData(data);

});

chart.update({nodes: [{address: 'a'}, {address: 'b'}, {address: 'c'}], links: [{source: 'a', target : 'b'}, {source: 'a', target : 'c'}, {source: 'c', target : 'b'}]});
setTimeout(()=>{
    chart.update({nodes:
            [
                {address: 'a'},
                {address: 'b'},
                {address: 'c'},
                {address: 'd'}
            ],
        links: [
            {source: 'a', target : 'd'},
            {source: 'a', target : 'b'},
            {source: 'a', target : 'c'},
            {source: 'c', target : 'b'}
        ]
    })
}, 5000);
setTimeout(()=>{
    chart.update({nodes:
            [
                {address: 'a'},
                {address: 'b'},
                {address: 'c'},
                {address: 'd'}
            ],
        links: [
            {source: 'a', target : 'd'},
            {source: 'c', target : 'd'},
            {source: 'a', target : 'b'},
            {source: 'a', target : 'c'},
            {source: 'c', target : 'b'}
        ]
    })
}, 7000);
