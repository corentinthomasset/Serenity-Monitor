import { Model } from '@vuex-orm/core';
import Block from './Block';

export default class Miner extends Model {
    static entity = 'miners';
    static primaryKey = 'address';

    static fields() {
        return {
            address: this.string(''),
            mined_blocks: this.hasMany(Block, 'miner_address')
        };
    }
}
