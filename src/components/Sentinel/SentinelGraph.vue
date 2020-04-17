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
    nodes() {
        let nodes = [];
        this.nodes_addresses.forEach(address => nodes.push({id: address, name:this.shortAddress(address)}));
        this.devices.forEach(device => nodes.push({id: device.$id, name: device.name}))
        return nodes
    },
    devices(){
        return this.sentinel.devices;
    },
    nodes_addresses(){
        let nodes_addresses = []
        let firstNeighborsLinks = NetworkLink.query().where('source', this.sentinel.address).orWhere('target', this.sentinel.address).get();
        firstNeighborsLinks.forEach(netLink => {
            if (nodes_addresses.indexOf(netLink.source) === -1) nodes_addresses.push(netLink.source);
            if (nodes_addresses.indexOf(netLink.target) === -1) nodes_addresses.push(netLink.target);
        });

        nodes_addresses.forEach(address => {
            let secNeighbors = NetworkLink.query().where('source', address).orWhere('target', address).get();
            secNeighbors.forEach(netLink => {
                if (nodes_addresses.indexOf(netLink.source) === -1) nodes_addresses.push(netLink.source);
                if (nodes_addresses.indexOf(netLink.target) === -1) nodes_addresses.push(netLink.target);
            });
        });
        return nodes_addresses
    },
    links() {
        let links = [];
        this.devices.forEach(device => links.push({tid: device.$id, sid: this.sentinel.address}))
        this.nodes_addresses.forEach(address => {
            let netLinks = NetworkLink.query().where('source',address).get();
            netLinks.forEach(netLink => {
                if(this.nodes_addresses.indexOf(netLink.target) >= 0) links.push({tid: netLink.target, sid: address});
            })
        });
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