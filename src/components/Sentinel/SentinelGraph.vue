<template>
  <div id="sentinel_graph">
    <NodeIcon :style="iconStyle" v-bind:hash="sentinel.address" />
  </div>
</template>

<script>
import NetworkLink from "../../store/Models/NetworkLink";
import NodeIcon from "../NodeIcon";
import * as d3 from "d3";

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
      iconStyle: "translate(10px,10px);"
    };
  },
  computed: {
    devices() {
      return this.sentinel.devices;
    },
    nodes() {
      let nodes = [];
      nodes.push({
        id: this.sentinel.address,
        name: this.shortAddress(this.sentinel.address),
        type: 0
      });

      this.devices.forEach(device =>
        nodes.push({ id: device.$id, name: device.name, type: 1 })
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
      console.log(nodes);
      return nodes;
    },
    links() {
      let links = [];
      this.devices.forEach(device =>
        links.push({ target: device.$id, source: this.sentinel.address })
      );
      this.nodes.forEach(node => {
        let address = node.id;
        let netLinks = NetworkLink.query()
          .where("source", address)
          .get();
        netLinks.forEach(netLink => {
          let exists = this.nodes.some(node => node.id === netLink.target);
          if (exists) links.push({ target: netLink.target, source: address });
        });
      });
      console.log(links);
      return links;
    },
    
  },
  methods: {
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
    this.width= width;
    this.iconStyle = "translate(" + this.width / 2 + "px, " + this.height / 2 + "px);";

    const svg = d3
      .selectAll("#sentinel_graph")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g");

    let radius = 0.1 * Math.min(width, height);
    svg
      .append("circle")
      .attr("r", radius * 1.5)
      .attr("fill", "#0000")
      .attr("stroke", "purple")
      .attr("cx", width / 2)
      .attr("cy", height / 2);

    svg
      .append("text")
      .text("Protected devices")
      .attr("x", width / 2)
      .attr("y", height / 2 - radius * 1.5 - 5)
      .attr("text-anchor", "middle")
      .attr("style", "font-size:12px;");

    svg
      .append("circle")
      .attr("r", radius * 2.5)
      .attr("fill", "#0000")
      .attr("stroke", "purple")
      .attr("cx", width / 2)
      .attr("cy", height / 2);

    svg
      .append("text")
      .text("Neighbors")
      .attr("x", width / 2)
      .attr("y", height / 2 - radius * 2.5 - 5)
      .attr("text-anchor", "middle")
      .attr("style", "font-size:12px;");

    svg
      .append("circle")
      .attr("r", radius * 3.5)
      .attr("fill", "#0000")
      .attr("stroke", "purple")
      .attr("cx", width / 2)
      .attr("cy", height / 2);

    svg
      .append("text")
      .text("N+1 Neighbors")
      .attr("x", width / 2)
      .attr("y", height / 2 - radius * 3.5 - 5)
      .attr("text-anchor", "middle")
      .attr("style", "font-size:12px;");

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
      .attr("fill", d => {
        switch (d.type) {
          case 0: // main
            return "red";
          case 1: // device
            return "blue";
          case 2: // first
            return "pink";
          case 3: // second
            return "green";
          default:
            return "black";
        }
      })
      .call(this.drag(simulation));

    const labels = node
      .append("text")
      .text(d => (d.type === 0 ? "" : d.name))
      .attr("style", "font-size:12px;")
      .attr("stroke", "black")
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
<style>
</style>