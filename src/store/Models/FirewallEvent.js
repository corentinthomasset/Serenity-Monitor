import { Model } from '@vuex-orm/core';

export default class FirewellEvent extends Model {
    static entity = 'firewallEvents';
    static primaryKey = 'address';

    static fields() {
        return {
            address: this.string(''),
            allow: this.number(0),
            deny: this.number(0),
            timestamp: this.number(0)
        };
    }
}
