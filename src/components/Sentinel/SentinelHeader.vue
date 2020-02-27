<template>
    <div id="sentinel_header">
        <NodeIcon :hash="sentinel.address"/>
        <div class="sentinel_id">
            <h3>
                Sentinel <Hash :hash="sentinel.address"/>
            </h3>
            <h4>{{sentinel.address}}</h4>
        </div>
        <div class="sentinel_info card">
            <table class="card_body">
                <tr>
                    <th>IP</th>
                    <th>Neighbors</th>
                    <th>Devices</th>
                </tr>
                <tr>
                    <td>{{sentinel.ip}}</td>
                    <td>{{neighborCount}}</td>
                    <td>{{deviceCount}}</td>
                </tr>
            </table>
        </div>
        <h5 class="last_block_mined" v-if="lastBlockMined">Last block mined: <Hash :hash="lastBlockMined.block_hash"/> on {{new Date(lastBlockMined.timestamp).toLocaleString()}}</h5>
    </div>
</template>

<script>
import NodeIcon from "../NodeIcon";
import Hash from "../Hash";
import Block from "../../store/Models/Block";
import NetworkLink from "../../store/Models/NetworkLink";
export default {
    name: "SentinelHeader",
    components: {Hash, NodeIcon},
    props: ['sentinel'],
    computed: {
        lastBlockMined(){
            return Block.query().where('miner_address', this.sentinel.address).orderBy('timestamp', 'desc').get()[0];
        },
        deviceCount(){
            return this.sentinel.devices.length;
        },
        neighborCount(){
            return NetworkLink.query().where('source', this.sentinel.address).orWhere('target', this.sentinel.address).count();
        }
    }
}
</script>

<style scoped>
#sentinel_header{
    margin-bottom: 30px;
}
.node_icon{
    width: 60px;
    height: 60px;
    margin: 20px auto;
    box-shadow: 0 0 20px rgba(113, 0, 255, .3), 0 1px 3px rgba(0, 0, 0, .08);
}

.sentinel_id h3, .sentinel_id h4{
    text-align: center;
    margin: 0;
}

.sentinel_id h4{
    font-size: 0.8em;
    color: #adb5bd;
    font-weight: 400;
    word-wrap: break-word;
    width: 230px;
    margin: 0 auto;
}

.sentinel_info{
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
</style>
