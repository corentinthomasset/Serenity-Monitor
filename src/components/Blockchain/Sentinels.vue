<template>
    <div id="sentinels">
        <h1>Sentinels</h1>
        <div v-if="sentinels.length > 0">
            <Dominance :chainId="chainId" :blocks="blocks"/>
            <SentinelList :chainId="chainId"/>
        </div>
        <Empty desc="No sentinel on this chain" icon="wifi-slash" v-else/>
    </div>
</template>

<script>
import Dominance from "./Dominance";
import SentinelList from "./SentinelList";
import CurrentBlock from "../../store/Models/CurrentBlock";
import Empty from "../Empty";
export default {
    name: "Sentinels",
    props: ['chainId', 'blocks'],
    components: {Empty, SentinelList, Dominance},
    computed: {
        sentinels(){
            return CurrentBlock.query().with('sentinel').where('chain_id', this.chainId).get();
        }
    }
}
</script>

<style scoped>

</style>
