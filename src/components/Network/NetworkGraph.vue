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
            <input class="slider" id="zoom_range" type="range" v-model="zoomLevel">
            <label for="zoom_range">+</label>
        </div>
        <Tooltip :address="selectedNode"/>
    </div>
</template>

<script>
import * as d3 from "d3";
import Sentinel from "../../store/Models/Sentinel";
import NetworkLink from "../../store/Models/NetworkLink";
import Tooltip from "../Tooltip";
import Bus from '../../bus.js';
export default {
    name: 'NetworkGraph',
    components: {Tooltip},
    data() {
        return {
            zoomLevel: 1,
            chart: null,
            selectedNode:  ''
        }
    },
    computed: {
        nodes() {
            let netNodes = Sentinel.all();
            let nodes = [];
            netNodes.forEach(node => {
                nodes.push({address: node.address, name: this.shortAddress(node.address)});
            });
            return nodes;
        },
        links() {
            let netLinks = NetworkLink.all();
            let links = [];
            netLinks.forEach(link => {
                if (Sentinel.find(link.source) && Sentinel.find(link.target)) {
                    links.push({source: link.target, target: link.source});
                }
            });
            return links;
        },
        chartData() {
            return {nodes: this.nodes, links: this.links}
        }
    },
    methods: {
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
        resizeListener(){
            this.chart.update(this.chartData);
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

            let container = svg.append("g")
                .attr("transform","scale(1)");

            d3.select("#zoom_range")
                .datum({})
                .attr("value", zoom.scaleExtent()[0])
                .attr("min", zoom.scaleExtent()[0])
                .attr("max", zoom.scaleExtent()[1])
                .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 100)
                .on("input", ()=>{this.slided(zoom, svg)});


            let graph_width = document.getElementById('network_graph').getBoundingClientRect().width;
            let graph_height = document.getElementById('network_graph').getBoundingClientRect().height;

            let simulation = d3.forceSimulation()
                .force("link", d3.forceLink().id(d => {
                    return d.address;
                }))
                .force("charge", d3.forceManyBody().strength(-400))
                .force("center", d3.forceCenter(graph_width / 2, graph_height / 2));

            let link = container.selectAll(".link");

            let node = container.selectAll(".node");

            let tip = d3.select("#network_graph .tooltip")
                .style("opacity", 0);

            let vue = this;
            this.chart = Object.assign(container.node(), {
                update({nodes, links}) {

                    const old = new Map(node.data().map(d => [d.address, d]));
                    links = links.map(d => Object.assign({}, d));
                    nodes = nodes.map(d => Object.assign(old.get(d.address) || {}, d));

                    link = link
                        .data(links, d => [d.source, d.target])
                        .join(enter=>enter.insert("line", ":first-child")).style("stroke", "rgba(50, 50, 93, 0.4)").attr('class', 'link');

                    node = node
                        .data(nodes, d => d.address)
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
                    let width = document.getElementById('network_graph').getBoundingClientRect().width;
                    let height = document.getElementById('network_graph').getBoundingClientRect().height;

                    simulation.force("center", d3.forceCenter(width / 2, height / 2));
                    simulation.nodes(nodes).on("tick", ()=>{vue.ticked(link, node)});
                    simulation.force("link").links(links);
                    simulation.alpha(1).restart();
                }
            });

            this.chart.update(this.chartData);

        window.addEventListener("resize", this.resizeListener);

        Bus.$on('sentinel::mouseover', address => {
            this.nodeFocus(address, link, tip);
        });

        Bus.$on('sentinel::mouseleave', address => {
            this.nodeBlur(address, link, tip);
        });
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.resizeListener);
        Bus.$off();
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
    background: rgba(0, 0, 0, .8);
    list-style: none;
    border-radius: 15px;
    color: #fff;
    padding: 5px 5px;
    display: flex;
    justify-content: space-between;
}

.network_info ul li {
    margin: 0 5px;
    font-size: .9em;
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
    opacity: .3;
    font-weight: 500;
}

#zoom_range {
    -webkit-appearance: none;
    height: 5px;
    border-radius: 5px;
    background: rgba(0, 0, 0, .1);
    outline: none;
    -webkit-transition: .2s;
    transition: opacity .2s;
}

#zoom_range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, .2);
}

#zoom_range::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, .2);
}

</style>
