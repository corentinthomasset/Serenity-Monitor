<template>
    <div id="hx_pool">
        <h1>WhitePool</h1>
        <div v-if="hxPool.length > 0">
            <h2>Latest confirmed packet signatures</h2>
            <ul class="hx_pool">
                <li :key="`${hx.hx}-${hx.block_hash}`" v-for="hx in hxPool">
                    <Hash :hash="hx.hx" class="hx trusted"/>
                    in block
                    <Hash :hash="hx.block_hash"/>
                </li>
            </ul>
        </div>
        <Empty desc="No trusted signature yet" icon="fingerprint" v-else/>
    </div>
</template>

<script>

import Hx from "../../store/Models/Hx";
import Empty from "../Empty";
import Hash from "../Hash";

export default {
    name: 'WhitePool',
    components: {Hash, Empty},
    props: ['chainId'],
    computed: {
        hxPool() {
            return Hx.query().where('confirmed', true).where('chain_id', this.chainId).get().slice(-10).reverse();
        },
    },
};
</script>

<style scoped>
</style>
