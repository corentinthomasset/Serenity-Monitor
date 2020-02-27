<template>
    <div id="device_list">
        <h2>Devices</h2>
        <ul>
            <DeviceCard v-for="device in devices" :key="device.ip" :device="device" v-on:attack="attack"/>
        </ul>
    </div>
</template>

<script>
import DeviceCard from "./DeviceCard";
import Socket from '../../socket';
export default {
    name: "DevicesList",
    components: {DeviceCard},
    props: ['sentinel'],
    computed:{
        devices(){
            return this.sentinel.devices;
        }
    },
    methods:{
        attack(...args){
            Socket.emit('attack', this.sentinel.address, ...args);
        }
    }
}
</script>

<style scoped>
#device_list{
    margin-top: 20px;
}
#device_list ul {
    display: flex;
    justify-content: flex-start;
    padding: 10px 0;
    list-style: none;
}
</style>
