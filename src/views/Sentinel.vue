<template>
    <div id="sentinel" class="view" :key="address">
        <div>
            <router-link to="/" class="back"><font-awesome-icon :icon="['fal', 'arrow-left']"/></router-link>
            <SentinelHeader :sentinel="sentinel"/>
            <h1>Blockchains</h1>
            <ChainList :sentinel="sentinel"/>
            <h1>Network</h1>
            <SentinelList :sentinel="sentinel"/>
        </div>
        <div>
            <h1>Packet filter</h1>
            <FilterActivity :sentinel="sentinel"/>
            <DevicesList :sentinel="sentinel"/>
            <FilterRules :sentinel="sentinel"/>
        </div>
        <div>
            <DarkPool :sentinel="sentinel"/>
        </div>
    </div>
</template>

<script>
import SentinelHeader from "../components/Sentinel/SentinelHeader";
import Sentinel from "../store/Models/Sentinel";
import ChainList from "../components/Sentinel/ChainList";
import DarkPool from "../components/Sentinel/DarkPool";
import SentinelList from "../components/Sentinel/SentinelList";
import FilterActivity from "../components/Sentinel/FilterActivity";
import DevicesList from "../components/Sentinel/DevicesList";
import FilterRules from "../components/Sentinel/FilterRules";
export default {
    name: "Sentinel",
    components: {FilterRules, DevicesList, FilterActivity, SentinelList, DarkPool, ChainList, SentinelHeader},
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
