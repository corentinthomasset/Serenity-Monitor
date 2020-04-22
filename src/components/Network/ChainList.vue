<template>
    <div id="chain_list">
        <h2>Blockchains</h2>
        <ul class="list">
            <ChainCard v-for="(chain, index) in chains" :key="chain.chain_id" :chain="chain" :style="`animation-delay: ${index/50}`"/>
        </ul>
    </div>
</template>

<script>
import ChainCard from "./ChainCard";
import CurrentBlock from "../../store/Models/CurrentBlock";
import Devices from "../../store/Models/Device";
export default {
    name: "ChainList",
    components: {ChainCard},
    computed: {
        chains(){
            let chains = {};
            let blocks = CurrentBlock.query().with('block').get();
            let devices = Devices.all();

            blocks.forEach(block=>{
                if(!chains[block.chain_id]){
                    chains[block.chain_id] = {};
                    chains[block.chain_id].chain_id = block.chain_id;
                    chains[block.chain_id].index = 0;
                    chains[block.chain_id].sentinels = 0;
                    chains[block.chain_id].devices = new Set();
                }
                if(chains[block.chain_id].index < block.block.index){
                    chains[block.chain_id].index = block.block.index;
                }
                chains[block.chain_id].sentinels += 1;
            });

            devices.forEach(device => {
                chains[device.chain_id].devices.add(device.name);
            });

            Object.keys(chains).forEach(chain=>{
                chains[chain].devices =  Array.from(chains[chain].devices).join(', ');
            });

            return chains;
        }
    }
}
</script>

<style scoped>

</style>
