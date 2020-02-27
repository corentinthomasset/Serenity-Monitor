import { Model } from '@vuex-orm/core';
import Block from './Block';

export default class Hx extends Model {
    static entity = 'hxs';
    static primaryKey = ['hx', 'block_hash'];

    static fields() {
      return {
          hx: this.string(''),
          block_hash: this.string(''),
          chain_id: this.string(''),
          confirmed: this.boolean(false),
          block: this.belongsTo(Block, 'block_hash')
      };
    }
}
