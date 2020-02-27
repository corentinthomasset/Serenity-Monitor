import { Model } from '@vuex-orm/core';

export default class DarkPool extends Model {
    static entity = 'darkPool';

    static primaryKey = ['id'];

    static fields() {
        return {
            id: this.uid(),
            hx: this.string(''),
            address: this.string(''),
            chain_id: this.string('')
        };
    }
}
