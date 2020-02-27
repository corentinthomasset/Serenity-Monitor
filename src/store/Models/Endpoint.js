import { Model } from '@vuex-orm/core';
import Fingerprint from "./Fingerprint";

export default class Endpoint extends Model {
    static entity = 'endpoints';
    static primaryKey = 'ip';

    static fields() {
        return {
            ip: this.string(''),
            activity: this.number(0),
            fingerprints: this.hasMany(Fingerprint, 'remote_ip'),
        };
    }
}
