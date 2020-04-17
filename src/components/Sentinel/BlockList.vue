<template>
    <div id="dark_pool">
        <h2>Dark pool</h2>
        <div v-if="darkPool.length > 0">
            <ul class="hx_pool">
                <li :key="hx" v-for="hx in fingerprints">
                    <Hash :hash="hx" class="hx"/>
                </li>
            </ul>
        </div>
        <Empty desc="No packet signatures in block candidates" icon="fingerprint" v-else/>
    </div>
</template>

<script>
import Empty from "../Empty";
import Hash from "../Hash";
import DarkPool from "../../store/Models/DarkPool";

export default {
    name: 'DarkPool',
    props: ['sentinel'],
    components: {Hash, Empty},
    computed: {
        darkPool() {
            return DarkPool.query().where('address', this.sentinel.address).get();
        },
        fingerprints(){
            let fingerprints = new Set();
            this.darkPool.forEach(fingerprint=>{
                fingerprints.add(fingerprint.hx);
            });
            return fingerprints;
        }
    },
};
</script>

<style scoped>
.hx_pool li {
    display: inline-block;
}
</style>
