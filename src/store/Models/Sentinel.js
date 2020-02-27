import { Model } from '@vuex-orm/core'
import Device from "./Device";
import Block from "./Block";
import CurrentBlock from "./CurrentBlock";
import Darkpool from "./DarkPool";

export default class Sentinel extends Model {
    // This is the name used as module name of the Vuex Store.
    static entity = 'sentinels';
    static primaryKey = 'address';

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields () {
        return {
            address: this.string(''),
            ip: this.string(''),
            devices: this.hasMany(Device, 'sentinel_address'),
            current_blocks: this.belongsToMany(Block, CurrentBlock, 'address', 'block_hash'),
            darkpool: this.hasMany(Darkpool, 'address')
        }
    }
}
