<template>
    <div id="chain_list">
        <h2>Registered blockchains</h2>
        <ul class="list">
            <ChainCard v-for="(block, index) in sentinel.current_blocks" :key="block.chain_id" :block="block" :style="`animation-delay: ${index/50}`"/>
        </ul>
    </div>
</template>

<script>
import ChainCard from "./ChainCard";
export default {
    name: "ChainList",
    components: {ChainCard},
    props: ['sentinel']
}
</script>

<style scoped>

</style>
