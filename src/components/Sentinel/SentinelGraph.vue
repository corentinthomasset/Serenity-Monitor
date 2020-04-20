<template>
  <div id="sentinel_graph">
      <d3-network id="graph" :net-nodes="nodes" :net-links="links" :options="options"/>
  </div>
</template>

<script>
import NetworkLink from "../../store/Models/NetworkLink";
import D3Network from 'vue-d3-network';
// import * as d3 from 'd3';

export default {
    name: 'SentinelGraph',
    props: ['sentinel'],
    components:{
        D3Network
    },
    data() {
        return{
            options: {
                nodeLabels: true,
                strLinks: true,
                nodeSize: 8,
                force: 1500
            }
        }
  },
  computed:{
    devices(){
        return this.sentinel.devices;
    },
    nodes(){
        let nodes = []
        nodes.push({id: this.sentinel.address, name: this.shortAddress(this.sentinel.address), type: 0})

        this.devices.forEach(device => nodes.push({id: device.$id, name: device.name, type: 1}))

        let firstNeighborsLinks = NetworkLink.query().where('source', this.sentinel.address).orWhere('target', this.sentinel.address).get();
        firstNeighborsLinks.forEach(netLink => {
            let exists = nodes.some(node => node.id === netLink.source);
            if (!exists) nodes.push({id: netLink.source, name: this.shortAddress(netLink.source), type: 2});
            exists = nodes.some(node => node.id === netLink.target);
            if (!exists) nodes.push({id: netLink.target, name: this.shortAddress(netLink.target), type: 2});
        });

        nodes.forEach(node => {
            let address = node.id
            let secNeighbors = NetworkLink.query().where('source', address).orWhere('target', address).get();
            secNeighbors.forEach(netLink => {
                let exists = nodes.some(node => node.id === netLink.source);
                if (!exists) nodes.push({id: netLink.source, name: this.shortAddress(netLink.source), type: 3});
                exists = nodes.some(node => node.id === netLink.target);
                if (!exists) nodes.push({id: netLink.target, name: this.shortAddress(netLink.target), type: 3});
            });
        });
        console.log(nodes)
        return nodes
    },
    links() {
        let links = [];
        this.devices.forEach(device => links.push({tid: device.$id, sid: this.sentinel.address}))
        this.nodes.forEach(node => {
            let address = node.id
            let netLinks = NetworkLink.query().where('source', address).get();
            netLinks.forEach(netLink => {
                let exists = this.nodes.some(node => node.id === netLink.target);
                if(exists) links.push({tid: netLink.target, sid: address});
            })
        });
        console.log(links)
      return links;
    }
  },
  methods: {
    shortAddress(address){
      return address.slice(0, 3) + address.slice(-3);
    },
  },
}
</script>
<style>
</style>