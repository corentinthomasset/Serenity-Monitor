<template>
    <li class="device_card">
        <div class="device_chain">
            <h3>{{stripName(device.name)}}</h3>
            <Hash :hash="device.chain_id"/>
        </div>
        <div :class="['device_status', status]">
            <font-awesome-icon :icon="statusIcon" class="icon"/>
        </div>
        <button @click="attack()" class="attack">Attack !</button>
    </li>
</template>

<script>
import Hash from "../Hash";
import Fingerprint from "../../store/Models/Fingerprint";
export default {
    name: "DeviceCard",
    components: {Hash},
    props: ['device'],
    computed: {
        fingerprints(){
            return Fingerprint.query().where('device_ip', this.device.ip).where('sentinel_address', this.device.sentinel_address).get();
        },
        status(){
            let trusted = false;
            let blocked = false;
            let status = 'blocked';

            for(let i = 0; i < this.fingerprints.length; i++){
                if(this.fingerprints[i].verdict){
                    trusted = true;
                    status = 'quarantine';
                } else {
                    blocked = true;
                }
                if(trusted === true && trusted === blocked){
                    break;
                }
            }

            if(trusted === true && blocked === false){
                status = 'trusted';
            }

            return status;
        },
        statusIcon(){
            switch(this.status){
                case 'quarantine':
                    return ['fas','biohazard'];
                case 'blocked':
                    return ['fas','ban'];
            }
            return ['fas','shield-check'];
        }
    },
    methods: {
        stripName(name){
            return name.length < 20 ? name : name.substring(0,17) + "..."
        },
        attack(){
            this.$emit('attack', this.device.ip, 'http_scan');
        }
    }

}
</script>

<style scoped>
.device_card{
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    box-shadow: 0 0 20px rgba(113, 0, 255, .05), 0 1px 3px rgba(0, 0, 0, .08);
    border-radius: 10px;
    padding: 5px 10px;
    margin: 0 10px;
    position: relative;
}

.device_card .device_chain{
    margin-right: 20px;
}

.device_card h3{
    margin: 0;
    font-size: 1em;
}

.device_card .hash{
    color: #adb5bd;
    font-weight: 400;
    font-size: .9em;
}

.device_card .device_status{
    width: 25px;
    height: 25px;
    border-radius: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    box-shadow: 0 0 20px rgba(113, 0, 255, .05), 0 1px 3px rgba(0, 0, 0, .08);
}

.device_card .device_status.trusted{
    background: linear-gradient(#00E676, #1ef984);
}

.device_card .device_status.quarantine{
    background: linear-gradient(45deg, rgb(255, 238, 88), rgb(249, 168, 37));
}

.device_card .device_status.blocked{
    background: linear-gradient(45deg, rgb(239, 83, 80), rgb(198, 40, 40));
}

.attack{
    position: absolute;
    bottom: -25px;
    left: 0;

}

</style>
