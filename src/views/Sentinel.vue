<template>
    <div id="sentinel" class="view" :key="address">
        <div>
            <router-link to="/" class="back"><font-awesome-icon :icon="['fas', 'arrow-left']"/></router-link>
            <SentinelHeader :sentinel="sentinel"/>
            <h1>Neighbors</h1>
            <SentinelList :sentinel="sentinel"/>
        </div>
        <NetworkGraph :sentinel="sentinel"/>
        <div>
            <BlockList :sentinel="sentinel"/>
        </div>
    </div>
</template>

<script>
import SentinelHeader from "../components/Sentinel/SentinelHeader";
import Sentinel from "../store/Models/Sentinel";
import BlockList from "../components/Sentinel/BlockList";
import SentinelList from "../components/Sentinel/SentinelList";
import NetworkGraph from "../components/Sentinel/NetworkGraph";
export default {
    name: "Sentinel",
    components: {SentinelHeader, SentinelList, BlockList, NetworkGraph},
    props: ['address'],
    computed: {
        sentinel(){
            return Sentinel.query().withAll().where('address', this.address).get()[0];
        }
    }
}
</script>

<style scoped>
</style>
