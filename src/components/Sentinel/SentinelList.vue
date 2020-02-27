<template>
    <div id="sentinels">
        <div class="list_header">
            <h2>Neighbors</h2>
        </div>
        <ul v-if="neighbors.length > 0" class="list">
            <SentinelCard v-for="(neighbor, index) in neighbors" :key="neighbor.address" :sentinel="neighbor" :style="`animation-delay: ${index/15}s`"/>
        </ul>
        <Empty v-else desc="No neighbor" icon="wifi-slash"/>
    </div>
</template>

<script>
import Sentinel from "../../store/Models/Sentinel";
import SentinelCard from "./SentinelCard";
import Empty from "../Empty";
import NetworkLink from "../../store/Models/NetworkLink";

export default {
    name: "SentinelList",
    components: {Empty, SentinelCard},
    props: ['sentinel'],
    computed: {
        neighbors(){
            let neighborsAddresses = NetworkLink.query().where('source', this.sentinel.address).orWhere('target', this.sentinel.address).get();
            let neighbors = [];
            neighborsAddresses.forEach(netLink=>{
                let address = netLink.source !== this.sentinel.address ? netLink.source : netLink.target;
                neighbors.push(Sentinel.query().where('address', address).with('devices').get()[0]);
            });
            return neighbors;
        }
    }
}
</script>

<style scoped>
</style>
