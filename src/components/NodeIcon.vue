<template>
    <div :style="hashGradient" class="node_icon">
        <img :src="`data:image/png;base64,${identicon}`" height=40 width=40>
    </div>
</template>

<script>
import Identicon from 'identicon.js';
import toMaterialStyle from 'material-color-hash';

export default {
    name: 'NodeIcon',
    props: ['hash'],
    computed: {
        identicon() {
            const options = {
                foreground: [249,250,254],
                background: [0, 0, 0, 0],
                margin: 0.2,
                format: 'png',
                size: 100,
            };

            return new Identicon(this.hash, options).toString();
        },

        hashGradient() {
            return `background: linear-gradient(45deg, ${toMaterialStyle(this.hash, '400').backgroundColor}, ${toMaterialStyle(this.hash, '800').backgroundColor})`;
        }
    }
};
</script>

<style scoped>
.node_icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 40px;
    position: relative;
    box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
}

.node_icon img {
    width: 90%;
    height: 90%;
    -webkit-filter: drop-shadow(0 0 2px rgba(0,0,0,.1));
}
</style>
