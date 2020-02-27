<template>
    <li class="list_card" @click="goToSentinel()">
        <NodeIcon v-bind:hash="sentinel.address"/>
        <div class="sentinel_info card">
            <table class="card_body">
                <tr>
                    <th>Address</th>
                    <th>Current block</th>
                    <th>Index</th>
                </tr>
                <tr>
                    <td><Hash v-bind:hash="sentinel.address"/></td>
                    <td><Hash v-bind:hash="currentBlock.block_hash"/></td>
                    <td>{{index}}</td>
                </tr>
            </table>
        </div>
    </li>
</template>

<script>
import Hash from "../Hash";
import NodeIcon from "../NodeIcon";
import CurrentBlock from "../../store/Models/CurrentBlock";

export default {
    name: 'SentineCard',
    props: ['sentinel', 'chainId'],
    components: {
        NodeIcon,
        Hash
    },
    computed: {
        currentBlock(){
            return CurrentBlock.query().where('address', this.sentinel.address).where('chain_id', this.chainId).with('block').get()[0];
        },
        index(){
            let index;
            if(this.currentBlock.block){
                index = this.currentBlock.block.index;
            } else {
                index = '?';
            }
            return index;
        }
    },
    methods: {
        goToSentinel(){
            this.$router.push({name: 'sentinel', params:{address: this.sentinel.address}});
        }
    }
};
</script>

<style scoped>
</style>
