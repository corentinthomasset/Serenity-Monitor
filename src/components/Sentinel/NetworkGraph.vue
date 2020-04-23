<template>
  <div id="network_graph">
    <div class="network_info">
      <ul>
        <li>Sentinels: {{nodes.length}}</li>
        <li>Links: {{links.length}}</li>
      </ul>
    </div>
    <div class="controls">
      <label for="zoom_range">-</label>
      <input class="slider" id="zoom_range" type="range" v-model="zoomLevel" />
      <label for="zoom_range">+</label>
    </div>
    <Tooltip :address="selectedNode" />
  </div>
</template>

<script>
import * as d3 from "d3";
import NetworkLink from "../../store/Models/NetworkLink";
import Tooltip from "../Tooltip";
import Bus from '../../bus.js';
import Sentinel from "../../store/Models/Sentinel";

export default {
    name: 'NetworkGraph',
    props: ["sentinel"],
    components: {Tooltip},
    data() {
        return {
            zoomLevel: 1,
            chart: null,
            selectedNode:  '',
            width : 0,
            height : 0
        }
    },
    computed: {
        devices() {
            return this.sentinel.devices;
        },
        n_neighbors() {
            let count = 0;
            this.nodes.forEach(node => {
                if (node.type === 2) {
                    count += 1
                }
            });
            return count;
        },
        n_sec_neighbors() {
            let count = 0;
            this.nodes.forEach(node => {
                if (node.type === 3) {
                    count += 1
                }
            });
            return count;
        },
        nodes() {
            let nodes = [];
            nodes.push({
                address: this.sentinel.address,
                name: this.shortAddress(this.sentinel.address),
                type: 0
            });

            this.devices.forEach(device =>
                nodes.push({address: device.ip.replace(/\./g,''), name: device.name, type: 1})
            );

            let firstNeighborsLinks = NetworkLink.query()
                .where("source", this.sentinel.address)
                .orWhere("target", this.sentinel.address)
                .get();
            firstNeighborsLinks.forEach(netLink => {
                let exists = nodes.some(node => node.address === netLink.source);
                if (!exists)
                    nodes.push({
                        address: netLink.source,
                        name: this.shortAddress(netLink.source),
                        type: 2
                    });
                exists = nodes.some(node => node.address === netLink.target);
                if (!exists)
                    nodes.push({
                        address: netLink.target,
                        name: this.shortAddress(netLink.target),
                        type: 2
                    });
            });

            nodes.forEach(node => {
                let address = node.address;
                let secNeighbors = NetworkLink.query()
                    .where("source", address)
                    .orWhere("target", address)
                    .get();
                secNeighbors.forEach(netLink => {
                    let exists = nodes.some(node => node.address === netLink.source);
                    if (!exists)
                        nodes.push({
                            address: netLink.source,
                            name: this.shortAddress(netLink.source),
                            type: 3
                        });
                    exists = nodes.some(node => node.address === netLink.target);
                    if (!exists)
                        nodes.push({
                            address: netLink.target,
                            name: this.shortAddress(netLink.target),
                            type: 3
                        });
                });
            });
            return nodes;
        },
        links() {
            let links = [];
            this.devices.forEach(device =>
                links.push({target: device.ip.replace(/\./g,''), source: this.sentinel.address})
            );
            this.nodes.forEach(node => {
                let address = node.address;
                let netLinks = NetworkLink.query()
                    .where("source", address)
                    .get();
                netLinks.forEach(netLink => {
                    let exists = this.nodes.some(node => node.address === netLink.target);
                    if (exists) links.push({target: netLink.target, source: address});
                });
            });
            return links;
        },
        chartData() {
            return {nodes: this.nodes, links: this.links}
        }
    },
    methods: {
        newSentinel() {
            Sentinel.insert({
                data: {
                    address: 'azertyuiop',
                    ip: '1.2.3.4'
                }
            });

            NetworkLink.insert({
                data: {id: '1', source: 'azertyuiop', target: this.sentinel.address}
            });
        },
        shortAddress(address) {
            return address.slice(0, 3) + address.slice(-3);
        },
        ticked(link, node) {
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

            node.attr("transform", (d)=> { return "translate(" + d.x + "," + d.y + ")"; });
        },
        dragstarted(d, simulation) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        },
        dragged(d, tip) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;

            tip.style("left", (d3.event.x + 40) + "px")
                .style("top", (d3.event.y - 10) + "px");
        },
        dragended(d, simulation) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        },
        nodeFocus(address, link, tip) {
            d3.select(`#s${address}`).select('circle').style('fill', '#A62DF8').style('stroke', '#fff').style('stroke-width', '5px').attr('r', '10px');
            link.style('stroke', (link_d)=> {
                return link_d.source.address === address || link_d.target.address === address ? '#A62DF8' : 'rgba(50, 50, 93, 0.4)';
            });

            tip.transition()
                .duration(200)
                .style("opacity", 1);

            let circleRect = document.querySelector(`#s${address}>circle`).getBoundingClientRect();
            tip.style("left", (circleRect.x - 310) + "px")
                .style("top", (circleRect.y - 15) + "px");

            this.selectedNode = address;
        },
        nodeBlur(address, link, tip) {
            d3.select(`#s${address}`).select('circle').style('fill', "#32325d").style('stroke-width', '0').attr('r', '5px');
            link.style('stroke', '#aaa')
                .style('stroke-width', '1');

            tip.transition()
                .duration(500)
                .style("opacity", 0);
        },
        slided(zoom, svg){
            zoom.scaleTo(svg, d3.select("#zoom_range").property("value"));
        },
        zoomed() {
            const currentTransform = d3.event.transform;
            d3.select("#network_graph > svg > g > g").attr("transform", currentTransform);
            d3.select("#zoom_range").property("value", currentTransform.k);
        },
        drawCircles(container, graph_width, graph_height){
            var bigGradient = container
                .append("defs")
                .append("radialGradient")
                .attr("id", "big-rad-grad");

            bigGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "#fff");

            bigGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "#f7f7fe");

            container //big circle
                .append("circle")
                .attr("id", "big-circle");

            container
                .append("text")
                .text("N+1 Neighbors")
                .attr("id", "big-text");

            var medGradient = container
                .append("defs")
                .append("radialGradient")
                .attr("id", "med-rad-grad");

            medGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "#fff");

            medGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "#f6f4fe");

            container //medium circle
                .append("circle")
                .attr("id", "med-circle");

            container
                .append("text")
                .attr("id", "med-text")
                .text("Neighbors");

            var smallGradient = container
                .append("defs")
                .append("radialGradient")
                .attr("id", "sml-rad-grad");

            smallGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "#fff");

            smallGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "#f1e7fd");

            container //small circle
                .append("circle")
                .attr("id", "small-circle");

            container
                .append("text")
                .attr("id", "small-text")
                .text("Protected devices");

            this.updateCircles(graph_width, graph_height)

        },
        updateCircles(graph_width, graph_height){
            let radius = 0.1 * Math.min(graph_width, graph_height);
            d3.selectAll("#big-circle")
            .attr("r", radius * 3.5)
            .attr("fill", "url(#big-rad-grad)")
            .attr("stroke", "#a62df814")
            .attr("cx", graph_width / 2)
            .attr("cy", graph_height / 2);

            d3.selectAll("#big-text")
                .attr("x", graph_width / 2)
                .attr("y", graph_height / 2 - radius * 3.5 - 5)
                .attr("text-anchor", "middle")
                .attr("font-weight", "bold")
                .attr("style", "font-size:12px;")
                .style("fill", "#a62df8");

            d3.selectAll("#med-circle")
            .attr("r", radius * 2.5)
            .attr("fill", "url(#med-rad-grad)")
            .attr("stroke", "#a62df840")
            .attr("cx", graph_width / 2)
            .attr("cy", graph_height / 2);

            d3.selectAll("#med-text")
                .attr("x", graph_width / 2)
                .attr("y", graph_height / 2 - radius * 2.5 - 5)
                .attr("text-anchor", "middle")
                .attr("font-weight", "bold")
                .attr("style", "font-size:12px;")
                .style("fill", "#a62df8");

            d3.selectAll("#small-circle")
                .attr("r", radius * 1.5)
                .attr("fill", "url(#sml-rad-grad)")
                .attr("stroke", "#a62df8")
                .attr("cx", graph_width / 2)
                .attr("cy", graph_height / 2);

            d3.selectAll("#small-text")
                .attr("x", graph_width / 2)
                .attr("y", graph_height / 2 - radius * 1.5 - 5)
                .attr("text-anchor", "middle")
                .attr("style", "font-size:12px;")
                .attr("font-weight", "bold")
                .style("fill", "#a62df8");
        },
        simulate(simulation, nodes, links, tickFuntion) {
            return simulation.on("tick", tickFuntion)
                .nodes(nodes)
                .force("link",d3.forceLink(links).id(d => d.address))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(this.width / 2, this.height / 2))
                .force("CenterSelected", () => {
                    // Custom Force function to keep the selected node at the center of the svg
                    this.nodes.forEach(n => {
                        const node_dist = Math.sqrt(
                            Math.pow(n.x - this.width / 2, 2) + Math.pow(n.y - this.height / 2, 2)
                        );
                        const k = -0.01;
                        const radius = 0.1 * Math.min(this.width, this.height);
                        const radius_dist = n.type * radius;
                        const diff = node_dist - radius_dist;
                        switch (n.type) {
                            case 0:
                                n.fx = this.width / 2;
                                n.fy = this.height / 2;
                                break;
                            default:
                                n.vx += Math.min(
                                    Math.max(k * (n.x - this.width / 2) * diff, -100),
                                    100
                                );
                                n.vy += Math.min(
                                    Math.max(k * (n.y - this.height / 2) * diff, -100),
                                    100
                                );
                                break;
                        }
                    });
                });
        }
},
    watch: {
        chartData(chartData) {
            this.chart.update(chartData);
        }
    },
    mounted() {
            let zoom = d3.zoom()
                .scaleExtent([0.01, 2])
                .on("zoom", this.zoomed);

            let svg = d3.select("#network_graph")
                .append("svg")
                .append("g")
                .call(d3.zoom())
                .call(zoom.transform, d3.zoomIdentity.scale(1));

            let nodesRef = this.nodes
            let linksRef = this.links

            let simulation = d3.forceSimulation()
            this.simulate(simulation, nodesRef, linksRef )

            let container = svg.append("g")
                .attr("transform","scale(1)");

            this.width = document.getElementById('network_graph').getBoundingClientRect().width;
            this.height = document.getElementById('network_graph').getBoundingClientRect().height;
            this.drawCircles(container, this.width, this.height);

            d3.select("#zoom_range")
                .datum({})
                .attr("value", zoom.scaleExtent()[0])
                .attr("min", zoom.scaleExtent()[0])
                .attr("max", zoom.scaleExtent()[1])
                .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 100)
                .on("input", ()=>{this.slided(zoom, svg)});

            let link = container.selectAll(".link");

            let node = container.selectAll(".node");

            let tip = d3.select("#network_graph .tooltip")
                .style("opacity", 0);

            let vue = this;
            this.chart = Object.assign(container.node(), {
                update({nodes, links}) {

                    // const old = new Map(node.data().map(d => [d.address, d]));
                    let newLinks = links//.map(d => Object.assign({}, d));
                    let newNodes = nodes//.map(d => Object.assign(old.get(d.address) || {}, d));

                    vue.simulate(simulation, newNodes, newLinks, () => vue.ticked(link, node));

                    link = link
                        .data(newLinks, d => [d.source, d.target])
                        .join(enter=>enter.insert("line"))
                        .style("stroke", "rgba(50, 50, 93, 0.4)")
                        .attr("stroke-opacity", d => d.source.type == 0 || d.target.type == 0 ? 0 : 0.3)
                        .attr('class', 'link');

                    node = node
                        .data(newNodes, d => d.address)
                        .join(enter => {
                            let n = enter.append("g")
                                .attr("class", "node")
                                .attr("id", d=>'s' + d.address)
                                .call(d3.drag()
                                    .on("start", d=>{vue.dragstarted(d, simulation)})
                                    .on("drag", d=>{vue.dragged(d, tip)})
                                    .on("end",  d=>{vue.dragended(d, simulation)}))
                                .on('mouseover', d=>{vue.nodeFocus(d.address, link, tip)})
                                .on('mouseleave', d=>{vue.nodeBlur(d.address, link, tip)});

                            n.append("circle")
                            .attr("r", 5)
                            .style("fill", "#32325d");

                            n.append("text")
                                .attr("dx", 12)
                                .attr("dy", ".2em")
                                .text((d)=> { return d.name });

                            return n;
                        });
                }
            });

            this.chart.update(this.chartData);

        window.addEventListener("resize", ()=>{
            this.width = document.getElementById('network_graph').getBoundingClientRect().width;
            this.height = document.getElementById('network_graph').getBoundingClientRect().height;
            this.updateCircles(this.width, this.height)
            this.chart.update(this.chartData);
        });

        Bus.$on('sentinel::mouseover', address => {
            this.nodeFocus(address, link, tip);
        });

        Bus.$on('sentinel::mouseleave', address => {
            this.nodeBlur(address, link, tip);
        });
    }
}
</script>

<style>
#network_graph {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-content: stretch;
  align-items: stretch;
  position: relative;
  overflow: hidden;
}

#network_graph svg {
  width: 100%;
  height: 100%;
}

#network_graph .node {
  cursor: pointer;
}

#network_graph .node-label {
  font-family: sans-serif;
  stroke: #000;
}

#network_graph .link {
  stroke: rgba(50, 50, 93, 0.4);
}

#network_graph text {
  font-family: sans-serif;
  font-size: 10px;
}

.network_info {
  position: absolute;
  top: 50px;
}

.network_info ul {
  background: rgba(0, 0, 0, 0.8);
  list-style: none;
  border-radius: 15px;
  color: #fff;
  padding: 5px 5px;
  display: flex;
  justify-content: space-between;
}

.network_info ul li {
  margin: 0 5px;
  font-size: 0.9em;
}

.controls {
  position: absolute;
  width: 100%;
  bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.controls label {
  font-size: 1.2em;
  pointer-events: none;
  margin: -2px 5px 0 5px;
  opacity: 0.3;
  font-weight: 500;
}

#zoom_range {
  -webkit-appearance: none;
  height: 5px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.1);
  outline: none;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

#zoom_range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

#zoom_range::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
