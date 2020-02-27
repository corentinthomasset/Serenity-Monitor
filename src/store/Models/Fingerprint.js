import { Model } from '@vuex-orm/core';
import Hx from "./Hx";
import Endpoint from "./Endpoint";

export default class Fingerprint extends Model {

    static entity = 'fingerprints';
    static primaryKey = ['hash', 'sentinel_address', 'device_ip'];

    static fields() {
        return {
            hash: this.string(''),
            sentinel_address: this.string(''),
            device_ip: this.string(''),
            endpoint_ip: this.string(''),
            protocol: this.number(0),
            port: this.string(''),
            verdict: this.boolean(false),
            timestamp: this.number(0),
            endpoint: this.belongsTo(Endpoint,'endpoint_ip'),
            hx: this.hasOne(Hx, 'hx')
        };
    }
}
