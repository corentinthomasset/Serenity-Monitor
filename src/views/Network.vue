<template>
  <div id="network" class="view">
    <div>
      <NetworkHeader/>
      <h1>Sentinels</h1>
      <SentinelList/>
    </div>
    <NetworkGraph/>
    <div>
      <h1>Devices</h1>
      <DeviceStats/>
    </div>
  </div>
</template>

<script>
import SentinelList from "../components/Network/SentinelList";
import NetworkGraph from "../components/Network/NetworkGraph";
import DeviceStats from "../components/Network/DeviceStats";
import NetworkHeader from "../components/Network/NetworkHeader";
export default {
  name: 'Network',
  components: {
    NetworkHeader,
    DeviceStats,
    SentinelList,
    NetworkGraph
  }
}
</script>
