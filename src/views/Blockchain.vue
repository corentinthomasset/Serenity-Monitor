<template>
    <div id="blockchain" class="view">
        <div>
            <router-link to="/" class="back"><font-awesome-icon :icon="['fas', 'arrow-left']"/></router-link>
            <BlockchainHeader  :chainId="chainId"/>
            <Sentinels :chainId="chainId" :blocks="blocks"/>
        </div>
        <div>
            <div @click="showNetwork = !showNetwork" class="network_switch">{{toggleText}} <font-awesome-icon class="icon" :icon="['fas', toggleIcon]"/></div>
            <div v-if="!showNetwork">
                <Consensus :chainId="chainId"/>
                <BlockchainGraph :chainId="chainId" :blocks="blocks"/>
            </div>
            <NetworkGraph :chainId="chainId" v-else/>
        </div>
        <div>
            <div v-if="chainId !== 'serenity_control_chain'">
                <WhitePool :chainId="chainId"/>
                <DarkPool :chain-id="chainId"/>
            </div>
            <ConfirmedBlockPool :chainId="chainId" v-else/>
        </div>
    </div>
</template>

<script>
import Block from "../store/Models/Block";
import Consensus from "../components/Blockchain/Consensus";
import BlockchainGraph from "../components/Blockchain/BlockchainGraph";
import WhitePool from "../components/Blockchain/WhitePool";
import ConfirmedBlockPool from "../components/Blockchain/ConfirmedBlockPool";
import DarkPool from "../components/Blockchain/DarkPool";
import Sentinels from "../components/Blockchain/Sentinels";
import BlockchainHeader from "../components/Blockchain/BlockchainHeader";
import NetworkGraph from "../components/Blockchain/NetworkGraph";

export default {
    name: "Blockchain",
    components: {
        NetworkGraph,
        BlockchainHeader, Sentinels, DarkPool, ConfirmedBlockPool, BlockchainGraph, Consensus, WhitePool},
    props: ['id'],
    data(){
        return {
            showNetwork: true
        }
    },
    computed: {
        chainId(){
            return this.id || 'serenity_control_chain';
        },
        blocks(){
            return Block.query().where('chain_id', this.chainId).with('hxs').get();
        },
        toggleIcon(){
            return this.showNetwork ? 'toggle-on' : 'toggle-off';
        },
        toggleText(){
            return this.showNetwork ? 'Hide network graph' : 'Show network graph';
        }
    }
}
</script>

<style>
.hx_pool{
    margin: 0px;
    padding: 5px 0px;
    list-style: none;
    max-height: 290px;
}

.hx_pool li{
    font-size: 0.7em;
    color: #adb5bd;
    padding: 7px 0px;
    animation: slide 0.6s ease;
}

.hx{
    margin: 0px 5px 0px 0px;
    border-radius: 5px;
}

.hx:not(.trusted){
    padding: 1px 3px;
    color: #7100ff;
    border: 1px dashed #7100ff;
}

.hx.trusted{
    padding: 3px;
    background: linear-gradient(45deg, #7100ff, #c027ff);
    color: #fff;
    box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
}

.network_switch{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    position: fixed;
    z-index: 10;
    right: 365px;
    box-sizing: border-box;
    padding: 5px 20px;
    background: #f9fafe;
    color: #adb5bd;
}

.network_switch .icon{
    font-size: 1.3em;
    margin: 5px;
}
</style>
