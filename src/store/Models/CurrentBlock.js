import { Model } from '@vuex-orm/core';
import Block from "./Block";
import Sentinel from "./Sentinel";

export default class CurrentBlock extends Model {
    static entity = 'currentBlocks';

    static primaryKey = ['address', 'chain_id'];

    static fields () {
        return {
            address: this.string(''),
            chain_id: this.string(''),
            block_hash: this.string(''),
            block: this.belongsTo(Block, 'block_hash'),
            sentinel: this.belongsTo(Sentinel, 'address')
        }
    }
}
