<template>
    <div id="dominance">
        <h2>Dominance</h2>
        <ul id="dominance_chart">
            <li v-for="(miner, index) in dominance" :key="miner[0]" class="miner">
                <span class="miner_info" v-if="miner[0] !== 'Others'">
                    <NodeIcon :hash="miner[0]"/>
                    <Hash :hash="miner[0]" />
                </span>
                <span class="miner_info" v-else>
                    <span class="other_icon">{{miners.length - dominance.length + 1}}</span>
                    <span>{{miner[0]}}</span>
                </span>
                <span class="chart_bar">
                    <span class="bar" :style="getBarLength(index)"/>
                    {{miner[1]}}%
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
    import Miner from "../../store/Models/Miner";
    import NodeIcon from "../NodeIcon";
    import Hash from "../Hash";

    export default {
        name: 'Dominance',
        components: {Hash, NodeIcon},
        props: ['chainId', 'blocks'],
        computed: {
            miners() {
                return Miner.query().with('mined_blocks', (query) => {
                    query.where('chain_id', this.chainId)
                }).get();
            },
            dominance() {
                let total = this.blocks.length || 0;
                let dominance = [];

                this.miners.forEach(miner => {
                    let mb = miner.mined_blocks.length;
                    dominance.push([miner.address,+((mb/total)*100).toFixed(1)]);
                });

                dominance.sort((a,b)=>{
                   return b[1] - a[1];
                });

                dominance = dominance.slice(0,5);

                let others = 0;
                dominance.forEach(i=>{
                    others += i[1];
                });

                if(others < 98 && others){
                    dominance.push(["Others", (100 - others).toFixed(1)]);
                }

                return dominance;
            }
        },
        methods:{
            getBarLength(index){
                return `width: ${this.dominance[index][1]}%;`
            }
        }
    };
</script>

<style>
    #dominance_chart{
        list-style: none;
        margin: 0;
        padding: 10px 0px;
    }

    #dominance_chart .miner{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 20px;
        padding: 5px 0px;
    }

    #dominance_chart .miner .miner_info{
        display: flex;
        align-items: center;
        font-size: 0.8em;
        font-weight: 600;
    }

    #dominance_chart .miner .miner_info .node_icon{
        transform: scale(0.5);
        margin-left: -10px;
    }

    #dominance_chart .miner .miner_info .other_icon{
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

    #dominance_chart .chart_bar{
        width: 150px;
        height: 7px;
        font-size: 0.7em;
        color: #adb5bd;
        display: flex;
        align-items: center;
    }

    #dominance_chart .chart_bar .bar{
        display: block;
        height: 7px;
        border-radius: 15px;
        background: linear-gradient(45deg, #7100ff, #c027ff);
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
        margin-right: 3px;
        transition: all 0.5s ease;
    }


</style>
