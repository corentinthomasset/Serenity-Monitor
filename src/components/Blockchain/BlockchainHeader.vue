<template>
    <div id="blockchain_header">
        <div class="chain_id">
            <div class="chain_icon">
                <font-awesome-icon class="icon" :icon="['fas','link']"/>
            </div>
            <h3 v-if="chainId !== 'serenity_control_chain'">
                <Hash :hash="chainId"/> ({{stripName(chains[chainId])}})
                <font-awesome-icon class="icon" :icon="['fas','chevron-down']" @click="toggleMenu()"/>
            </h3>
            <h3 v-else>{{chainId}}
                <font-awesome-icon class="icon" :icon="['fas','chevron-down']" @click="toggleMenu()"/>
            </h3>
            <ul id="chain_select_menu" v-if="showMenu" @mouseleave="toggleMenu()">
                <router-link
                        tag="li"
                        v-for="(devices, chain, index) in chains"
                        :key="chain" :to="`/blockchain/${chain}`"
                        :style="`animation-delay: .${index}s`"
                        @click.native="toggleMenu()">
                    <div class="chain_icon">
                        <font-awesome-icon class="icon" :icon="['fas','link']"/>
                    </div>
                    <span v-if="chain !== 'serenity_control_chain'">
                        <Hash :hash="chain"/> <span>({{devices}})</span>
                    </span>
                    <span v-else><span>{{chain}}</span></span>
                </router-link>
            </ul>
            <h4 v-if="chainId !== 'serenity_control_chain'">{{chainId}}</h4>
        </div>
        <div class="chain_info card">
            <table class="card_body">
                <tr>
                    <th>Current fork</th>
                    <th>Index</th>
                    <th>Sentinels</th>
                </tr>
                <tr>
                    <td><Hash v-bind:hash="currentFork.block_hash"/></td>
                    <td>{{currentFork.index}}</td>
                    <td>{{sentinelCount}}</td>
                </tr>
            </table>
        </div>
        <h5 class="last_block_mined">Last block mined: <Hash :hash="lastBlockMined.block_hash"/> on {{new Date(lastBlockMined.timestamp).toLocaleString()}}</h5>

    </div>
</template>

<script>
import Hash from "../Hash";
import Device from "../../store/Models/Device";
import Block from "../../store/Models/Block";
import CurrentBlock from "../../store/Models/CurrentBlock";
export default {
    name: "BlockchainHeader",
    components: {Hash},
    props: ['chainId'],
    data(){
        return ({
            showMenu: false
        });
    },
    computed: {
        currentFork(){
            return Block.query().where('chain_id', this.chainId).orderBy('index', 'desc').get()[0];
        },
        sentinelCount(){
            return CurrentBlock.query().where('chain_id', this.chainId).count();
        },
        lastBlockMined(){
            return Block.query().where('chain_id', this.chainId).orderBy('timestamp', 'desc').get()[0]
        },
        chains(){
            let chains = {};
            let blocks = CurrentBlock.all();
            let devices = Device.all();

            blocks.forEach(block=>{
                if(!chains[block.chain_id]){
                    chains[block.chain_id] = new Set();
                }
            });

            devices.forEach(device => {
                if(chains[device.chain_id]){
                    chains[device.chain_id].add(device.name);
                }
            });

            Object.keys(chains).forEach(chain=>{
               chains[chain] =  Array.from(chains[chain]).join(', ');
            });

            return chains;
        }
    },
    methods:{
        toggleMenu(){
            this.showMenu = !this.showMenu;
        },
        stripName(name){
            return name.length < 20 ? name : name.substring(0,17) + "..."
        }
    }
}
</script>

<style scoped>
#blockchain_header{
    margin-bottom: 30px;
}
.chain_icon{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    border-radius: 60px;
    margin: 20px auto;
    background: linear-gradient(45deg, #7100ff, #c027ff);
    box-shadow: 0 0 20px rgba(113, 0, 255, .3), 0 1px 3px rgba(0, 0, 0, .08);
}

.chain_icon .icon{
    color: #fff;
    font-size: 1.5em;
}

.chain_id h3, .chain_id h4{
    text-align: center;
    margin: 0;
}

.chain_id h4{
    font-size: 0.8em;
    color: #adb5bd;
    font-weight: 400;
    word-wrap: break-word;
    width: 230px;
    margin: 0 auto;
}

.chain_id h3 .icon{
    font-size: .8em;
    cursor: pointer;
}

.chain_info{
    margin: 15px auto 0 auto;
}

h5{
    font-size: 0.7em;
    font-weight: 400;
    color: #adb5bd;
    align-items: center;
    padding: 4px 0;
    display: flex;
    justify-content: center;
    margin: 5px;
}

#chain_select_menu{
    list-style: none;
    position: absolute;
    z-index: 5;
    background:  #f9fafe;
    border-radius: 20px;
    width: 300px;
    left: 20px;
    padding: 5px;
    margin: 0;
}

#chain_select_menu li{
    box-shadow: 0 0 20px rgba(113, 0, 255, .05), 0 1px 3px rgba(0, 0, 0, .08);
    border-radius: 20px;
    background: #fff;
    padding: 0;
    margin: 10px;
    cursor: pointer;
    animation: pop .2s ease;
    animation-fill-mode: forwards;
    opacity: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
}

#chain_select_menu li .chain_icon{
    transform: scale(.35);
    margin: -15px;
}

#chain_select_menu li > span > span:nth-child(1){
    font-weight: 700;
    font-size: .9em;
}

#chain_select_menu li > span{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 85%;
}

#chain_select_menu li > span >span:nth-child(2){
    font-size: .8em;
}
</style>
