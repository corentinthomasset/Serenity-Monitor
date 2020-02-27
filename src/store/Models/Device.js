import { Model } from '@vuex-orm/core'
import Sentinel from "./Sentinel";

export default class Device extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'devices';
    static primaryKey = ['ip', 'sentinel_address'];

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields () {
        return {
            ip: this.string(''),
            sentinel_address: this.string(''),
            name: this.string(''),
            sentinel: this.belongsTo(Sentinel, 'sentinel_address'),
            chain_id: this.string('')
        }
    }
}
