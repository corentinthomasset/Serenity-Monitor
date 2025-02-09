<template>
    <div id="sentinel_graph">
        <div :style="iconTransform" style="position:absolute;overflow-y: hidden;">
            <NodeIcon v-bind:hash="sentinel.address"/>
        </div>
        <div class="network_info">
            <ul>
                <li>Neighbors: {{n_neighbors}}</li>
                <li>N+1: {{n_sec_neighbors}}</li>
            </ul>
        </div>
        <button @click="newSentinel">CLick</button>
    </div>
</template>

<script>
import NetworkLink from "../../store/Models/NetworkLink";
import NodeIcon from "../NodeIcon";
import * as d3 from "d3";
import Sentinel from "../../store/Models/Sentinel";

export default {
    name: "SentinelGraph",
    props: ["sentinel"],
    components: {
        NodeIcon
    },
    data() {
        return {
            options: {
                nodeLabels: true,
                strLinks: true,
                nodeSize: 8,
                force: 1500
            },
            width: 100,
            height: 100
        };
    },
    computed: {
        devices() {
            return this.sentinel.devices;
        },
        iconTransform() {
            return (
                "transform: translate(" +
                (this.width / 2 - 20) +
                "px, " +
                (this.height / 2 - 20) +
                "px);"
            );
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
                id: this.sentinel.address,
                name: this.shortAddress(this.sentinel.address),
                type: 0
            });

            this.devices.forEach(device =>
                nodes.push({id: device.$id, name: device.name, type: 1})
            );

            let firstNeighborsLinks = NetworkLink.query()
                .where("source", this.sentinel.address)
                .orWhere("target", this.sentinel.address)
                .get();
            firstNeighborsLinks.forEach(netLink => {
                let exists = nodes.some(node => node.id === netLink.source);
                if (!exists)
                    nodes.push({
                        id: netLink.source,
                        name: this.shortAddress(netLink.source),
                        type: 2
                    });
                exists = nodes.some(node => node.id === netLink.target);
                if (!exists)
                    nodes.push({
                        id: netLink.target,
                        name: this.shortAddress(netLink.target),
                        type: 2
                    });
            });

            nodes.forEach(node => {
                let address = node.id;
                let secNeighbors = NetworkLink.query()
                    .where("source", address)
                    .orWhere("target", address)
                    .get();
                secNeighbors.forEach(netLink => {
                    let exists = nodes.some(node => node.id === netLink.source);
                    if (!exists)
                        nodes.push({
                            id: netLink.source,
                            name: this.shortAddress(netLink.source),
                            type: 3
                        });
                    exists = nodes.some(node => node.id === netLink.target);
                    if (!exists)
                        nodes.push({
                            id: netLink.target,
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
                links.push({target: device.$id, source: this.sentinel.address})
            );
            this.nodes.forEach(node => {
                let address = node.id;
                let netLinks = NetworkLink.query()
                    .where("source", address)
                    .get();
                netLinks.forEach(netLink => {
                    let exists = this.nodes.some(node => node.id === netLink.target);
                    if (exists) links.push({target: netLink.target, source: address});
                });
            });
            return links;
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
        drag(simulation) {
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

            return d3
                .drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }
    },
    mounted() {
        const nodes = this.nodes;
        const links = this.links;

        let width = document.getElementById("sentinel_graph").clientWidth;
        let height = document.getElementById("sentinel_graph").clientHeight;

        this.height = height;
        this.width = width;

        // was circles

        // Create a simulation with basic forces and connect nodes with links
        const simulation = d3
            .forceSimulation(nodes)
            .force(
                "link",
                d3.forceLink(links).id(d => d.id)
            )
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("CenterSelected", () => {
                // Custom Force function to keep the selected node at the center of the svg
                nodes.forEach(n => {
                    let node_dist = Math.sqrt(
                        Math.pow(n.x - width / 2, 2) + Math.pow(n.y - height / 2, 2)
                    );
                    let k = -0.01;
                    let radius_dist = n.type * radius;
                    let diff = node_dist - radius_dist;
                    switch (n.type) {
                        case 0:
                            n.fx = width / 2;
                            n.fy = height / 2;
                            break;
                        default:
                            n.vx += Math.min(
                                Math.max(k * (n.x - width / 2) * diff, -100),
                                100
                            );
                            n.vy += Math.min(
                                Math.max(k * (n.y - height / 2) * diff, -100),
                                100
                            );
                            break;
                    }
                });
            });

        // Create lines for the links
        const link = svg
            .append("g")
            .attr("stroke", "#999")
            .selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .attr("stroke-opacity", d =>
                d.source.type == 0 || d.target.type == 0 ? 0 : 0.3
            );

        // Create circles for the nodes and defirentiate the selected one in size and color
        const node = svg
            .append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("g");

        const balls = node
            .append("circle")
            .attr("r", d => (d.type == 0 ? 10 : 5))
            .attr("fill", "#32325d")
            .attr("cursor", "pointer")
            .attr("stroke-width", "0px")
            .on("mouseover", (d) => {
                tip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tip.html("Hello" + d.name)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .call(this.drag(simulation));

        const labels = node
            .append("text")
            .text(d => (d.type === 0 ? "" : d.name))
            .attr("style", "font-size:12px;")
            .attr("font-family", "Source Sans Pro")
            .style('fill', '#101010')
            .style('stroke', 'none')
            .attr("x", 10)
            .attr("y", 5);

        // Update the graph on tick
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            balls.attr("cx", d => d.x).attr("cy", d => d.y);

            labels.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
        });
    }
};
</script>
<style scoped>
.circle {
    fill: linear-gradient(#7100ff0f, #fff);
    stroke-width: 0px;
}

div.tooltip {
    position: absolute;
    text-align: center;
    width: 60px;
    height: 28px;
    padding: 2px;
    font: 12px sans-serif;
    background: lightsteelblue;
    border: 0px;
    border-radius: 8px;
    pointer-events: none;
}

.network_info {
    width: 53.5%;
    top: 30px;
    display: flex;
    justify-content: center;
    align-content: stretch;
    align-items: stretch;
    position: absolute;
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

#sentinel_graph {
    padding: 0;
}
</style>
