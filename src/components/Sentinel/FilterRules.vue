<template>
    <div id="filter_rules">
        <h2>Rules</h2>
        <div id="rules">
            <table class="rules_table accept" v-if="fingerprints.accepted.length > 0">
                <tr><th colspan="6">ACCEPT</th></tr>
                <tr v-for="fingerprint in fingerprints.accepted" :key="`${fingerprint.device_ip}-${fingerprint.hash}`">
                    <td><font-awesome-icon :icon="['fas', 'check-circle']"/></td>
                    <td><div class="legend">Protocol</div>{{getProtocolName(fingerprint.protocol)}}</td>
                    <td><div class="legend">Ip</div>{{fingerprint.endpoint_ip}}</td>
                    <td v-if="fingerprint.port"><div class="legend">Port</div>{{fingerprint.port}}</td>
                    <td><div class="legend">Hash</div><Hash :hash="fingerprint.hash"/></td>
                </tr>
            </table>

            <table class="rules_table drop" v-if="fingerprints.dropped.length > 0">
                <tr><th colspan="6">DROP</th></tr>
                <tr v-for="fingerprint in fingerprints.dropped" :key="`${fingerprint.device_ip}-${fingerprint.hash}`">
                    <td><font-awesome-icon :icon="['fas', 'times-hexagon']"/></td>
                    <td><div class="legend">Protocol</div>{{getProtocolName(fingerprint.protocol)}}</td>
                    <td><div class="legend">Ip</div>{{fingerprint.endpoint_ip}}</td>
                    <td v-if="fingerprint.port"><div class="legend">Port</div>{{fingerprint.port}}</td>
                    <td><div class="legend">Hash</div><Hash :hash="fingerprint.hash"/></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    import Hash from "../Hash";
    import Fingerprint from "../../store/Models/Fingerprint";
    export default {
        name: "FilterRules",
        props: ['sentinel'],
        components: { Hash},
        computed:{
            fingerprints(){
                let fingerprints = Fingerprint.query().where('sentinel_address', this.sentinel.address).get();
                let accepted = [];
                let dropped = [];
                fingerprints.forEach((fingerprint)=>{
                    if(fingerprint.hash && fingerprint.verdict){
                        accepted.push(fingerprint);
                    } else {
                        dropped.push(fingerprint);
                    }
                });
                return {accepted: accepted, dropped: dropped}
            }
        },
        methods:{
            getProtocolName(protocol){
                let name = protocol;
                switch (protocol) {
                    case 6:
                        name = 'TCP';
                        break;
                    case 17:
                        name = 'UDP';
                        break;
                    case 1:
                        name = 'ICMP';
                        break;
                }
                return name;
            }
        }
    }
</script>

<style scoped>
    #filter_rules{
        margin-top: 50px;
    }

    #rules{
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .rules_table{
        border: none;
        border-collapse: separate;
        border-spacing: 0 20px;
        max-width: 400px;
        flex: 1;
        margin: -10px 10px;
    }

    .rules_table tr{
        font-weight: 400;
        animation: slide-bottom 0.5s ease;
        text-align: center;
        border: none;
    }

    .rules_table th{
        color: rgba(173, 181, 189, 0.5);
        font-size: 1em;
        font-weight: 300;
    }

    .rules_table td .legend{
        color: #adb5bd;
        font-size: 0.7em;
    }

    .rules_table td{
        padding: 10px;
    }

    .rules_table td:not(:first-child){
        box-shadow: 6px 4px 6px rgba(50, 50, 93, .11), 3px 1px 3px rgba(0, 0, 0, .08);
        background: #fff;
        font-weight: 600;
        font-size: 0.8em;
    }

    .rules_table td:nth-child(2) {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }

    .rules_table td:last-child {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        box-shadow: 3px 4px 5px rgba(50, 50, 93, .11), 1px 1px 3px rgba(0, 0, 0, .08);
    }

    .rules_table td:not(:first-child):not(:nth-child(2)){
        border-left: 1px solid rgba(173, 181, 189, 0.15);
    }

    .rules_table.accept td:first-child{
         color: #1de476;
         font-weight: 900;
     }

    .rules_table.drop td:first-child{
         color: #ff1a51;
         font-weight: 900;
     }

    .rules_table td .device_icon{
        transform: scale(0.4);
        margin: -12px;
        display: inline-block;
        vertical-align: top;
    }

</style>
