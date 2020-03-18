<template>
    <div id="sentinels">
        <div class="list_header">
            <h2>Active sentinels</h2>
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
        <ul v-if="sentinels.length > 0" class="list">
            <SentineCard v-for="(sentinel, index) in sentinels" :key="sentinel.address" :sentinel="sentinel" :style="`animation-delay: ${index/15}s`"/>
        </ul>
        <Empty v-else desc="No sentinel connected" icon="question"/>
    </div>
</template>

<script>
import Sentinel from "../../store/Models/Sentinel";
import SentineCard from "./SentinelCard";
import Empty from "../Empty";

export default {
    name: "SentinelList",
    components: {Empty, SentineCard},
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
        sentinels(){
            let s;
            if(this.sortDesc){
                s = Sentinel.query().withAll().orderBy(this.sort[this.sortIndex % 2], 'desc').all();
            } else {
                s = Sentinel.query().withAll().orderBy(this.sort[this.sortIndex % 2]).all();
            }

            let filter = new RegExp(`.*${this.search}.*`, 'i');
            return s.filter(sentinel=>sentinel.address.match(filter) || sentinel.ip.match(filter));
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
