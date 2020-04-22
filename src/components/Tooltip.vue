<template>
    <div class="tooltip">
        <div class="node_info" v-if="address.length">
            <NodeIcon :hash="address"/>
            <div>
                <h3>{{shortAddress(address)}}</h3>
                <h4>{{sentinel.ip}}</h4>
            </div>
        </div>
        <table class="device_list" v-if="address.length">
                <tr v-for="block in sentinel.current_blocks" :key="block.block_hash">
                    <td>
                        <div class="chain_icon">
                            <font-awesome-icon class="icon" :icon="['fas','link']"/>
                        </div>
                    </td>
                    <td>
                        <h3>{{stripName(Array.from(devices[block.chain_id]).join(','))}}</h3>
                        <h4>{{shortAddress(block.chain_id)}}</h4>
                    </td>
                    <td class="blur">
                        {{shortAddress(block.block_hash)}}
                    </td>
                    <td class="blur">
                        {{block.index}}
                    </td>
                </tr>
        </table>
    </div>
</template>

<script>
import NodeIcon from "./NodeIcon";
import Sentinel from "../store/Models/Sentinel";
import Device from "../store/Models/Device";
export default {
    name: "Tooltip",
    props: ['address'],
    components: {NodeIcon},
    computed: {
      sentinel(){
          let sentinel = Sentinel.query().where('address', this.address).with('current_blocks').get()[0];
          sentinel.current_blocks.shift();
          return sentinel
      },
      devices (){
          let devices = Device.all();
          let chains = {};
          devices.forEach(device => {
              if(!chains[device.chain_id]){
                  chains[device.chain_id] = new Set();
              }
              chains[device.chain_id].add(device.name);
          });
          return chains;
      }
    },
    methods: {
        shortAddress(address) {
            return address.slice(0, 3) + address.slice(-3);
        },
        stripName(name){
            return name.length < 20 ? name : name.substring(0,17) + "..."
        }
    }
}
</script>

<style scoped>
.tooltip{
    position: absolute;
    transition: top .1s ease, left .1s ease;
    pointer-events: none;
}

.node_info{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 250px;
    height: 50px;
    background: #fff;
    box-shadow: 0 0 20px rgba(113, 0, 255, .05), 0 1px 3px rgba(0, 0, 0, .08);
    border-radius: 10px;
}

.node_info .node_icon{
    margin: 10px;
}

.node_info h3, .node_info h4{
    margin: 0;
    padding: 0;
    font-size: 1em;
}

.node_info h4{
    font-size: .8em;
    color: #adb5bd;
    font-weight: 400;
}

.chain_icon{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border-radius: 25px;
    background: linear-gradient(45deg, #7100ff, #c027ff);
    box-shadow: 0 0 20px rgba(113, 0, 255, .3), 0 1px 3px rgba(0, 0, 0, .08);
    padding: 5px;
    box-sizing: border-box;
}

.chain_icon .icon{
    color: #fff;
}

.device_list{
    width: 240px;
    background: rgba(240, 241, 246, 0.9);
    margin-left: 5px;
    padding: 5px;
    box-sizing: border-box;
    border-radius: 0 0 10px 10px;
}

.device_list h3, .device_list h4{
    margin: 0;
}

.device_list h3{
    font-size: .9em;
}

.device_list h4{
    font-size: .7em;
}

.device_list .blur{
    font-size: .9em;
    opacity: .8;
}
</style>
