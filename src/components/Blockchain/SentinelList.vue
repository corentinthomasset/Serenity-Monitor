<template>
    <div id="sentinels">
        <div class="list_header">
            <h2>Active nodes</h2>
            <ul class="action_menu">
                <li @click="toggleSort">
                    <font-awesome-icon :icon="sortIcon"/>
                    {{sortLabel[sortIndex%2]}}
                </li>
                <li class="search_bar">
                    <input id="search_bar_input" type="text" v-model="search"/>
                    <label for="search_bar_input">
                        <font-awesome-icon :icon="['fas', 'search']" v-if="!search.length"/>
                        <font-awesome-icon :icon="['fas', 'times']" @click="search = ''" v-else/>
                    </label>
                </li>
            </ul>
        </div>
        <ul class="list">
            <SentinelCard :chainId="chainId" :key="sentinel.address" :sentinel="sentinel"
                          v-for="(sentinel, index) in sentinels" :style="`animation-delay: ${index/15}s`"/>
        </ul>
    </div>
</template>

<script>
import SentinelCard from "./SentinelCard";
import CurrentBlock from "../../store/Models/CurrentBlock";

export default {
    name: "SentinelList",
    props: ['chainId'],
    components: {SentinelCard},
    data() {
        return ({
            sort: ['address', 'block_hash'],
            sortDesc: false,
            sortIndex: 0,
            sortLabel: ['Addr', 'Block'],
            search: ''
        });
    },
    computed: {
        sentinels() {
            let s;
            if (this.sortDesc) {
                s = CurrentBlock.query().with('sentinel').orderBy(this.sort[this.sortIndex % 2], 'desc').where('chain_id', this.chainId).get();
            } else {
                s = CurrentBlock.query().with('sentinel').orderBy(this.sort[this.sortIndex % 2]).where('chain_id', this.chainId).get();
            }

            let filter = new RegExp(`.*${this.search}.*`, 'i');
            return s.filter(sentinel => sentinel.address.match(filter) || sentinel.ip.match(filter));
        },
        sortIcon() {
            return this.sortDesc ? ['fas', 'sort-alpha-down'] : ['fas', 'sort-alpha-up'];
        }
    },
    methods: {
        toggleSort() {
            if (this.sortDesc) {
                this.sortIndex += 1;
            }
            this.sortDesc = !this.sortDesc;
        }
    }
}
</script>

<style scoped>
</style>
