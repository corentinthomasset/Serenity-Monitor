<template>
    <div id="device_stats">
        <h2>Most popular devices</h2>
        <ul id="device_chart" v-if="devices.length">
            <li v-for="(stat, chainId) in stats" :key="chainId">
                <div class="label" v-if="chainId !== 'unidentified'">
                    <span class="icon">{{stat.count}}</span>
                    <div class="device_chain">
                        <ul>
                            <li v-for="name in stat.devicesName" :key="name">
                                {{stripName(name)}}
                            </li>
                        </ul>
                        <Hash :hash="chainId"/>
                    </div>
                </div>
                <span class="label" v-else>
                    <span class="icon">{{stat.count}}</span>
                    <span>Unidentified</span>
                </span>
                <span class="chart_bar">
                    <span class="bar" :style="getBarLength(chainId)"></span>
                    {{stat.percentage}}%
                </span>
            </li>
        </ul>
        <Empty v-else desc="No device connected" icon="lightbulb-slash"/>
    </div>
</template>

<script>
import Device from "../../store/Models/Device";
import Hash from "../Hash";
import Empty from "../Empty";

export default {
    name: "DeviceStats",
    components: {Empty, Hash},
    computed: {
        devices(){
            return Device.query().with('sentinel').all();
        },
        stats(){
            let chains = {};
            let total = this.devices.length;

            this.devices.forEach(device=>{
                if(device.chain_id){
                    let chain_id = device.chain_id;
                    if(!chains[chain_id]){
                        chains[chain_id] = {count: 0, devicesName:[]}
                    }

                    chains[chain_id].count += 1;

                    if(!chains[chain_id].devicesName.includes(device.name)){
                        chains[chain_id].devicesName.push(device.name);
                    }
                } else {
                    if(!chains.unidentified){
                        chains.unidentified = {count: 0, devicesName:[]}
                    }
                    chains.unidentified.count += 1;
                }
            });

            Object.keys(chains).forEach(id=>{
                chains[id].percentage = ((chains[id].count / total) * 100).toFixed(2);
            });

            return chains;
        }
    },
    methods:{
        getBarLength(index){
            return `width: ${this.stats[index].percentage}%;`
        },
        stripName(name){
            return name.length < 20 ? name : name.substring(0,17) + "..."
        }
    }
}
</script>

<style scoped>
#device_stats h5{
    margin: 0;
    font-weight: 300;
    font-size: .8em;
    color: #cacaca;
}
#device_chart{
    list-style: none;
    margin: 0;
    padding: 10px 0px;
}

#device_chart > li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 20px;
    padding: 5px 0px;
    margin: 10px 0 ;
}

#device_chart .device_chain{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

#device_chart .device_chain ul{
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

#device_chart .device_chain ul li{
    padding: 0;
}

#device_chart .device_chain .hash{
    font-weight: 300;
    margin-top: -5px;
}

#device_chart li .label{
    display: flex;
    align-items: center;
    font-size: 0.8em;
    font-weight: 600;
}

#device_chart li .label .icon{
    background: linear-gradient(#7100ff, #c027ff);
    color: #fff;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    text-align: center;
    line-height: 20px;
    font-size: 0.8em;
    font-weight: 700;
    box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    margin: 0 10px 0 0;
}

#device_chart .chart_bar{
    width: 150px;
    height: 7px;
    font-size: 0.7em;
    color: #cacaca;
    display: flex;
    align-items: center;
}

#device_chart .chart_bar .bar{
    display: block;
    height: 7px;
    border-radius: 15px;
    background: linear-gradient(45deg, #7100ff, #c027ff);
    box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    margin-right: 3px;
    transition: all 0.5s ease;
}
</style>
