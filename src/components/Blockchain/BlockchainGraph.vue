<template>
    <div id="blockchain_graph">
        <h1>Blockchain</h1>
        <div>
            <canvas/>
            <ul>
                <li class="block_index" v-bind:key="indexes.length - index - 1" v-for="(blocks, index) in indexes">
                    <ul>
                        <li :class="getBlockClass(block)" :ref="block.block_hash" v-bind:key="block.block_hash"
                            v-for="block in blocks">
                            <ul class="block_info">
                                <li>
                                    <Hash :hash="block.block_hash"/>
                                    <ul v-if="block.hxs.length">
                                        <li v-for="hx in block.hxs.slice(0,2)" :key="hx.hx"><Hash :hash="hx.hx"/></li>
                                        <li v-if="block.hxs.length > 2">and {{block.hxs.length - 2}} others ...</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <h4>{{indexes.length - index - 1}}</h4>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import Hash from "../Hash";
    import CurrentBlock from "../../store/Models/CurrentBlock";
    export default {
        name: 'BlockchainGraph',
        components: {Hash},
        props: ['blocks', 'chainId'],
        data() {
            return ({
                longestChainIndex: 0,
            });
        },
        computed: {
            currentBlocks() {
                let currentBlocks = CurrentBlock.query().where('chain_id', this.chainId).get();
                let blocks = new Set();
                currentBlocks.forEach(block=>{
                   blocks.add(block.block_hash);
                });
                return blocks;
            },
            indexes(){
                let indexes = [];
                this.blocks.forEach(block=>{
                    if(!indexes[block.index]){
                        indexes[block.index] = [];
                    }
                    indexes[block.index].push(block);
                });
                return indexes.reverse();
            }
        },
        methods: {
            drawPaths() {
                const canvas = document.querySelector('#blockchain_graph > div > canvas');
                const blockchain = document.querySelector('#blockchain_graph > div');

                canvas.width = blockchain.getBoundingClientRect().width;
                canvas.height = blockchain.getBoundingClientRect().height;

                const canvasRect = canvas.getBoundingClientRect();

                if (canvas.getContext) {
                    const ctx = canvas.getContext('2d');
                    for (let i = 0; i < this.blocks.length; i++) {
                        if (this.$refs[this.blocks[i].previous_block_hash]) {
                            const block = this.$refs[this.blocks[i].block_hash][0].getBoundingClientRect();
                            const previous = this.$refs[this.blocks[i].previous_block_hash][0].getBoundingClientRect();

                            ctx.beginPath();
                            ctx.strokeStyle = '#adb5bd';
                            ctx.save();

                            if (this.blocks[i].confirmed) {
                                ctx.lineWidth = '2';
                            } else {
                                ctx.lineWidth = '1';
                                ctx.setLineDash([2, 2]);
                            }

                            const blockX = block.left - canvasRect.left + block.width / 2;
                            const blockY = block.top - canvasRect.top + block.height;

                            const previousX = previous.left - canvasRect.left + previous.width / 2;
                            const previousY = previous.top - canvasRect.top;

                            ctx.moveTo(blockX, blockY);
                            ctx.bezierCurveTo(blockX, blockY + 30, previousX, previousY - 30, previousX, previousY);
                            ctx.stroke();
                            ctx.closePath();
                            ctx.restore();
                        }
                    }
                }
            },
            isCurrent(hash) {
                return this.currentBlocks.has(hash);
            },
            getBlockClass(block) {
                let cls = 'block';
                if (this.isCurrent(block.block_hash)) {
                    cls += ' current';
                }
                if (block.confirmed) {
                    cls += ' confirmed';
                }
                return cls;
            },
        },
        updated() {
            this.$nextTick(() => {
                this.drawPaths();
            });
        },
        mounted() {
            this.$nextTick(() => {
                this.drawPaths();
            });
        },
        created() {
            window.addEventListener("resize", this.drawPaths);
        },
        destroyed() {
            window.removeEventListener("resize", this.drawPaths);
        }
    };
</script>

<style scoped>
    #blockchain_graph {
        position: relative;
        overflow-y: scroll;
        height: calc(100vh - (165px));
        box-sizing: border-box;
        margin-top: 15px;
    }

    #blockchain_graph canvas {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
    }

    #blockchain_graph ul {
        list-style: none;
        padding: 0;
    }

    #blockchain_graph .block_index > ul {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        padding-top: 10px;
    }

    .block_index > h4 {
        margin: 0;
        font-weight: 300;
        font-size: 0.6em;
        color: rgba(173, 181, 189, 0.8);
    }

    .block_index > ul {
        border-top: 1px dashed rgba(173, 181, 189, 0.3);
    }

    .block_index:first-child > ul {
        border: none;
    }

    .block {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
        position: relative;
        cursor: pointer;
        transition: color 2s ease, border 1s ease, box-shadow 0.5s linear;
        border: 1px solid #fff;
        color: rgba(173, 181, 189, 0.8);
    }

    .block_info {
        font-size: 0.6em;
        position: absolute;
        left: 50px;
    }

    #blockchain_graph .block .block_info ul {
        margin-left: 17px;
        padding-left: 1px;
        list-style: disc;
        white-space: nowrap;
    }

    .block:not(.confirmed) {
        background: none;
        box-shadow: none;
        border: 1px dashed #adb5bd;
    }

    .current {
        animation: bluePulse 1.5s infinite;
    }

    .confirmed {
        animation: greenPulse 1.5s linear;
    }

    .confirmed.current {
        animation: greenPulse 1.5s linear, bluePulseShadow 1.5s infinite 1.5s;
    }


    @keyframes bluePulse {
        0% {
            box-shadow: 0 0 0 0 rgba(113, 0, 255, 0.75);
        }

        70% {
            box-shadow: 0 0 0 7.5px rgba(113, 0, 255, 0);
        }

        100% {
            box-shadow: 0 0 0 0 rgba(113, 0, 255, 0);
        }
    }

    @keyframes bluePulseShadow {
        0% {
            box-shadow: 0 0 0 0 rgba(113, 0, 255, 0.75), 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
        }

        70% {
            box-shadow: 0 0 0 7.5px rgba(113, 0, 255, 0), 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
        }

        100% {
            box-shadow: 0 0 0 0 rgba(113, 0, 255, 0), 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
        }
    }

    @keyframes greenPulse {
        0% {
            box-shadow: 0 0 0 0 rgba(77, 228, 94, 0.8), 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
        }

        70% {
            box-shadow: 0 0 0 7.5px rgba(77, 228, 94, 0), 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
        }

        100% {
            box-shadow: 0 0 0 0 rgba(77, 228, 94, 0), 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
        }
    }

</style>
