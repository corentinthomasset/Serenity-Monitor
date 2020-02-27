<template>
    <li class="list_card" @click="goToChain()">
        <div class="chain_icon">
            <font-awesome-icon class="icon" :icon="['fal','link']"/>
        </div>
        <div class="chain_info card">
            <table class="card_body">
                <tr>
                    <th>Chain</th>
                    <th>Current block</th>
                    <th>Index</th>
                </tr>
                <tr>
                    <td v-if="block.chain_id !== 'serenity_control_chain'"><Hash :hash="block.chain_id"/></td>
                    <td v-else>c_chain</td>
                    <td><Hash :hash="block.block_hash"/></td>
                    <td>{{block.index}}</td>
                </tr>
            </table>
        </div>
    </li>
</template>

<script>
import Hash from "../Hash";
export default {
    name: "ChainCard",
    components: {Hash},
    props: ['block'],
    methods: {
        goToChain(){
            this.$router.push(`/blockchain/${this.block.chain_id}`);
        }
    }
}
</script>

<style scoped>
.chain_icon{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border-radius: 32px;
    background: linear-gradient(45deg, #7100ff, #c027ff);
    box-shadow: 0 0 20px rgba(113, 0, 255, .3), 0 1px 3px rgba(0, 0, 0, .08);
}

.chain_icon .icon{
    color: #fff;
    font-size: 1em;
}
</style>
