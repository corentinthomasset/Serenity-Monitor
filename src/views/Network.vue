<template>
  <div id="network" class="view">
    <div>
      <NetworkHeader/>
      <h1>Sentinels</h1>
      <SentinelList/>
    </div>
    <NetworkGraph/>
    <div>
      <h1>Blockchains</h1>
      <DeviceStats/>
      <ChainList/>
    </div>
  </div>
</template>

<script>
import SentinelList from "../components/Network/SentinelList";
import NetworkGraph from "../components/Network/NetworkGraph";
import DeviceStats from "../components/Network/DeviceStats";
import NetworkHeader from "../components/Network/NetworkHeader";
import ChainList from "../components/Network/ChainList";
export default {
  name: 'Network',
  components: {
    ChainList,
    NetworkHeader,
    DeviceStats,
    SentinelList,
    NetworkGraph
  }
}
</script>
