<template>
    <div id="hx_pool">
        <h1>Control chain</h1>
        <div v-if="hxPool.length > 0">
            <h2>Latest confirmed sub-chains blocks</h2>
            <ul class="hx_pool">
                <li :key="hx.hx" v-for="hx in hxPool">
                    <Hash :hash="hx.hx" class="hx trusted"/>
                    in block
                    <Hash :hash="hx.block_hash"/>
                </li>
            </ul>
        </div>
        <Empty desc="No confirmed block yet" icon="fingerprint" v-else/>
    </div>
</template>

<script>

import Hx from "../../store/Models/Hx";
import Empty from "../Empty";
import Hash from "../Hash";

export default {
    name: 'ConfirmedBlockPool',
    components: {Hash, Empty},
    props: ['chainId'],
    computed: {
        hxPool() {
            return Hx.query().where('confirmed', true).with('confirmation_block', (query)=>{
                query.where('chain_id', this.chainId)
            }).get().slice(-10).reverse();
        },
    },
};
</script>

<style scoped>
</style>
