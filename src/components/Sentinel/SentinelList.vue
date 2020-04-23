<template>
    <div id="sentinels">
        <div class="list_header">
            <h2>Active Sentinels</h2>
            <ul class="action_menu">
                <li @click="toggleSort"><font-awesome-icon :icon="sortIcon"/> {{sortLabel[sortIndex%2]}}</li>
                <li class="search_bar">
                    <input v-model="search" type="text" id="search_bar_input"/>
                    <label for="search_bar_input">
                        <font-awesome-icon v-if="!search.length" :icon="['fas', 'search']"/>
                        <font-awesome-icon v-else :icon="['fas', 'times']" @click="search = ''"/>
                    </label>
                </li>
            </ul>
        </div>
        <ul v-if="neighbors.length > 0" class="list">
            <SentinelCard v-for="(neighbor, index) in neighbors" :key="neighbor.address" :sentinel="neighbor" :style="`animation-delay: ${index/50}s`"/>
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
    data(){
        return({
            sort: ['address', 'ip'],
            sortDesc: false,
            sortIndex: 0,
            sortLabel: ['Addr', 'IP'],
            search: ''
        });
    },
    computed: {
        neighbors(){
            let neighborsAddresses = NetworkLink.query().where('source', this.sentinel.address).orWhere('target', this.sentinel.address).get();
            let neighbors = [];
            neighborsAddresses.forEach(netLink=>{
                let address = netLink.source !== this.sentinel.address ? netLink.source : netLink.target;
                neighbors.push(Sentinel.query().where('address', address).with('devices').get()[0]);
            });
            neighbors.sort((a,b) =>
                           (a[this.sort[this.sortIndex % 2]] > b[this.sort[this.sortIndex % 2]]) ? 1
                           : ((b[this.sort[this.sortIndex % 2]] > a[this.sort[this.sortIndex % 2]]) ? -1
                           : 0))

            if(this.sortDesc) {
                neighbors.reverse()
            }

            let filter = new RegExp(`.*${this.search}.*`, 'i');
            return neighbors.filter(n=>n.address.match(filter) || n.ip.match(filter));
        },
        sortIcon(){
            return this.sortDesc ? ['fas', 'sort-alpha-down']:['fas', 'sort-alpha-up'];
        }
    },
    methods: {
        toggleSort(){
            if(this.sortDesc){
                this.sortIndex += 1;
            }
            this.sortDesc = !this.sortDesc;
        }
    }
}
</script>

<style scoped>
</style>
