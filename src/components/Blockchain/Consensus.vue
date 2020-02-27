<template>
    <div id="consensus">
        <h1>Consensus</h1>
        <div class="graph">
            <div :key="index" :style="getStyle(block)" v-for="(block, index) in repartition">
                <span><Hash :hash="block[0]"/></span>
            </div>
        </div>
    </div>
</template>

<script>
import Hash from "../Hash";
import toMaterialStyle from 'material-color-hash';
import CurrentBlock from "../../store/Models/CurrentBlock";

export default {
    name: 'Consensus',
    props: ['chainId'],
    components: {Hash},
    data() {
        return ({
            graph: [['0', 1]],
        });
    },
    computed: {
        currentBlocks() {
            return CurrentBlock.query().where('chain_id', this.chainId).get();
        },
        repartition() {
            const rep = new Map();

            for (let i = 0; i < this.currentBlocks.length; i++) {
                const blockHash = this.currentBlocks[i].block_hash;
                if (!rep.has(blockHash)) {
                    rep.set(blockHash, 1);
                } else {
                    rep.set(blockHash, rep.get(blockHash) + 1);
                }
            }
            return [...rep.entries()].sort((a, b) => b[1] - a[1]);
        },
    },
    methods: {
        getColorFromString(string, shade) {
            let style = toMaterialStyle(string, shade);
            return style.backgroundColor;
        },

        getStyle(block) {
            return `flex-grow:${block[1]}; background: linear-gradient(45deg,${this.getColorFromString(block[0], '400')}, ${this.getColorFromString(block[0], '800')});`;
        }
    }
};
</script>

<style scoped>
#consensus {
    height: 120px;
    box-sizing: border-box;
}

.graph {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: 40px 0 20px 0;
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: auto;
}

.graph div {
    height: 30px;
    margin: 2px;
    border-radius: 5px;
    transition: flex 1s ease, background-color 0.5s ease;
    position: relative;
    box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
}

.graph div span {
    position: absolute;
    top: -10px;
    left: 0;
    font-size: 0.9em;
    color: #adb5bd;
}
</style>
