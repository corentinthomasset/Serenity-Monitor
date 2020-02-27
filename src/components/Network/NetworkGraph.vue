<template>
  <div id="network_graph">
    <d3-network :net-nodes="nodes" :net-links="links" :options="options" :key="zoomLevel"/>
    <div class="network_info">
      <ul>
        <li>Sentinels: {{nodes.length}}</li>
        <li>Links: {{links.length}}</li>
      </ul>
    </div>
    <div class="controls">
        <label for="zoom_range" @click="decreaseZoom">-</label>
        <input v-model="zoomLevel" type="range" min="1" max="5" class="slider" id="zoom_range">
        <label for="zoom_range" @click="increaseZoom">+</label>
    </div>
  </div>
</template>

<script>
import Sentinel from "../../store/Models/Sentinel";
import NetworkLink from "../../store/Models/NetworkLink";
import D3Network from 'vue-d3-network';

export default {
  name: 'NetworkGraph',
  components:{
    D3Network
  },
  data(){
    return{
      options: {
        nodeLabels: true,
        strLinks: true,
        nodeSize: 8,
        force: 1500
      },
      zoomLevel: 3
    }
  },
  computed:{
    nodes() {
      let netNodes = Sentinel.all();
      let nodes = [];
      netNodes.forEach(node=>{
        nodes.push({id: node.address, name: this.shortAddress(node.address)});
      });
      return nodes;
    },
    links () {
      let netLinks = NetworkLink.all();
      let links = [];
      netLinks.forEach(link=>{
        if(Sentinel.find(link.source) && Sentinel.find(link.target)) {
          links.push({tid: link.target, sid: link.source});
        }
      });
      return links;
    }
  },
  methods: {
    shortAddress(address){
      return address.slice(0, 3) + address.slice(-3);
    },
    zoom(level){
      switch(level){
        case '1':
          this.$set(this.options, 'nodeSize', 5);
          this.$set(this.options, 'force', 150);
          break;

        case '2':
          this.$set(this.options, 'nodeSize', 6);
          this.$set(this.options, 'force', 500);
          break;

        case '3':
          this.$set(this.options, 'nodeSize', 8);
          this.$set(this.options, 'force', 1500);
          break;

        case '4':
          this.$set(this.options, 'nodeSize', 10);
          this.$set(this.options, 'force', 2500);
          break;

        case '5':
          this.$set(this.options, 'nodeSize', 15);
          this.$set(this.options, 'force', 5000);
          break;
      }
    },
    decreaseZoom(){
      this.zoomLevel -= this.zoomLevel > 1 ? 1:0;
      this.zoomLevel += '';
    },
    increaseZoom(){
      this.zoomLevel -= this.zoomLevel < 5 ? -1:0;
      this.zoomLevel += '';
    }
  },
  watch: {
    zoomLevel(level){
      this.zoom(level);
    },
    nodes(nodes){
      if(nodes.length <= 10){
        this.zoomLevel = '5';
      } else if(nodes.length <= 20){
        this.zoomLevel = '4';
      } else if(nodes.length <= 50){
        this.zoomLevel = '3';
      } else if(nodes.length <= 250){
        this.zoomLevel = '2';
      } else {
        this.zoomLevel = '1';
      }
    }
  }
}
</script>

<style>
  #network_graph{
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-content: stretch;
    align-items: stretch;
    position: relative;
  }

  #network_graph .net{
    width: 100%;
  }

  #network_graph .node{
    cursor: pointer;
    fill: #32325d;
    stroke-width: 1px;
  }

  #network_graph .node-label{
    font-family: sans-serif;
    fill: rgba(119, 119, 119, .7);
  }

  #network_graph .link{
    stroke: rgba(50, 50, 93, 0.4);
  }

  .network_info{
    position: absolute;
    top: 50px;
  }

  .network_info ul {
    background: rgba(0,0,0,.8);
    list-style: none;
    border-radius: 15px;
    color: #fff;
    padding: 5px 5px;
    display: flex;
    justify-content: space-between;
  }

  .network_info ul li{
    margin:  0 5px;
    font-size: .9em;
  }

.controls{
  position: absolute;
  width: 100%;
  bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

}

.controls label {
  font-size: 1.2em;
  cursor: pointer;
  margin: -2px 5px 0 5px ;
}

  #zoom_range {
    -webkit-appearance: none;
    height: 5px;
    border-radius: 5px;
    background: rgba(0,0,0,.1);
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
    box-shadow: 0 0 10px rgba(0,0,0,.2);
  }

  #zoom_range::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,0,0,.2);
  }

</style>
