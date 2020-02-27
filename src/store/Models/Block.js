import { Model } from '@vuex-orm/core';
import Miner from './Miner';
import Hx from "./Hx";

export default class Block extends Model {
    static entity = 'blocks';

    static primaryKey = 'block_hash';

    static fields() {
        return {
            block_hash: this.string(''),
            miner_address: this.string(''),
            previous_block_hash: this.string(''),
            index: this.number(0),
            chain_id: this.string(''),
            timestamp: this.number(0),
            nonce: this.number(0),
            miner: this.belongsTo(Miner, 'miner_address'),
            hxs: this.hasMany(Hx, 'block_hash'),
            confirmed: this.boolean(false)
        };
    }
}
