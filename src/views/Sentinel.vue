<template>
    <div id="sentinel" class="view" :key="address">
        <div>
            <router-link to="/" class="back"><font-awesome-icon :icon="['fas', 'arrow-left']"/></router-link>
            <SentinelHeader :sentinel="sentinel"/>
            <h1>Neighbors</h1>
            <SentinelList :sentinel="sentinel"/>
        </div>
        <div>
            <div @click="showNetwork = !showNetwork" class="network_switch">{{toggleText}} <font-awesome-icon class="icon" :icon="['fas', toggleIcon]"/></div>
            <NetworkGraph :sentinel="sentinel"  v-if="showNetwork"/>
            <div v-else>
                <h1>Packet filter</h1>
                <FilterActivity :sentinel="sentinel"/>
                <DevicesList :sentinel="sentinel"/>
                <FilterRules :sentinel="sentinel"/>
            </div>
        </div>
        <div>
            <h1>Blockchains</h1>
            <ChainList :sentinel="sentinel"/>
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
import ChainList from "../components/Sentinel/ChainList";
import FilterActivity from "../components/Sentinel/FilterActivity";
import FilterRules from "../components/Sentinel/FilterRules";
import DevicesList from "../components/Sentinel/DevicesList";
export default {
    name: "Sentinel",
    components: {
        DevicesList,
        FilterRules, FilterActivity, ChainList, SentinelHeader, SentinelList, BlockList, NetworkGraph},
    props: ['address'],
    data(){
        return {
            showNetwork: false
        }
    },
    computed: {
        sentinel(){
            return Sentinel.query().withAll().where('address', this.address).get()[0];
        },
        toggleIcon(){
            return this.showNetwork ? 'toggle-on' : 'toggle-off';
        },
        toggleText(){
            return this.showNetwork ? 'Hide network graph' : 'Show network graph';
        }
    }
}
</script>

<style scoped>
.network_switch{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    position: fixed;
    z-index: 10;
    right: 365px;
    box-sizing: border-box;
    padding: 5px 20px;
    background: #f9fafe;
    color: #adb5bd;
}

.network_switch .icon{
    font-size: 1.3em;
    margin: 5px;
}
</style>
