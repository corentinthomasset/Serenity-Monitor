<template>
    <li class="list_card" @click="goToSentinel()">
        <NodeIcon v-bind:hash="sentinel.address"/>
        <div class="sentinel_info card">
            <table class="card_body">
                <tr>
                    <th>Address</th>
                    <th>IP</th>
                    <th>Neighbors</th>
                    <th>Devices</th>
                </tr>
                <tr>
                    <td><Hash v-bind:hash="sentinel.address"/></td>
                    <td>{{sentinel.ip}}</td>
                    <td>{{neighbors.length}}</td>
                    <td>{{sentinel.devices.length}}</td>
                </tr>
            </table>
        </div>
    </li>
</template>

<script>
import Hash from "../Hash";
import NetworkLink from "../../store/Models/NetworkLink";
import NodeIcon from "../NodeIcon";
export default {
    name: 'SentinelCard',
    props: ['sentinel'],
    components: {
        NodeIcon,
        Hash
    },
    computed: {
        neighbors (){
            return NetworkLink.query().where('source', this.sentinel.address).orWhere('target', this.sentinel.address).get();
        }
    },
    methods: {
        goToSentinel(){
            this.$router.push({name: 'sentinel', params:{address: this.sentinel.address}});
        }
    }
};
</script>

<style scoped>
</style>
