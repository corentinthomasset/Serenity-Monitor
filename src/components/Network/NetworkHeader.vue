<template>
    <div id="network_header">
        <div class="network_icon">
            <font-awesome-icon class="icon" :icon="['fas', 'shield-alt']"/>
        </div>
        <h3> Serenity Net</h3>
        <div class="net_info card">
            <table class="card_body">
                <tr>
                    <th>Sentinels</th>
                    <th>Links</th>
                    <th>Devices</th>
                </tr>
                <tr>
                    <td>{{sentinels}}</td>
                    <td>{{links}}</td>
                    <td>{{devices}}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>

import Sentinel from "../../store/Models/Sentinel";
import NetworkLink from "../../store/Models/NetworkLink";
import Device from "../../store/Models/Device";

export default {
    name: "NetworkHeader",
    computed: {
        sentinels(){
            return Sentinel.query().count();
        },
        links(){
            return NetworkLink.query().count();
        },
        devices(){
            return Device.query().count();
        }
    }
}
</script>

<style scoped>
#network_header{
    margin-bottom: 40px;
}

.network_icon{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    border-radius: 60px;
    margin: 20px auto;
    background: linear-gradient(45deg, #7100ff, #c027ff);
    box-shadow: 0 0 20px rgba(113, 0, 255, .3), 0 1px 3px rgba(0, 0, 0, .08);
}

.network_icon .icon{
    font-size: 2em;
    color: #fff;
}

.net_info{
    margin: 15px auto 0 auto;
}

h3{
    text-align: center;
    margin: 0;
    text-transform: uppercase;
    font-size: 1.5em;
}
</style>
