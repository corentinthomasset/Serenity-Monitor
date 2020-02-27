import io from 'socket.io-client';
import Settings from './settings';

import Sentinel from "./store/Models/Sentinel";
import NetworkLink from "./store/Models/NetworkLink";
import Device from "./store/Models/Device";
import Block from "./store/Models/Block";
import Hx from "./store/Models/Hx";
import CurrentBlock from "./store/Models/CurrentBlock";
import Miner from "./store/Models/Miner";
import DarkPool from "./store/Models/DarkPool";
import Fingerprint from "./store/Models/Fingerprint";
import Endpoint from "./store/Models/Endpoint";
import FirewallEvent from "./store/Models/FirewallEvent";

let socket = io.connect(`http://${Settings.server.ip}:${Settings.server.port}/ui`);

socket.on('connection', ()=>{
    console.log('connected');
});

socket.on('update', (update)=>{
    let sentinels = update.sentinels;
    let links = update.links;
    let devices = update.devices;
    let chains = update.chains;
    let blocks = update.blocks;
    let darkPools = update.darkPools;
    let fingerprints = update.fingerprints;
    let firewallEvents = update.firewallEvents;

    if(sentinels){
        Object.keys(sentinels).forEach(address=>{
            if(sentinels[address]){
                Sentinel.insert({
                    data: sentinels[address]
                });

                Miner.insert({data:{
                    address: address
                }});
            } else {
                Sentinel.delete(address);
                Device.delete((device)=>{
                   return device.sentinel_address === address;
                });
            }
        });
    }

    if(links){
        Object.keys(links).forEach(id=>{
            if(links[id]){
                NetworkLink.insert({
                    data: {id: id, source: links[id].source, target: links[id].target}
                });
            } else {
                NetworkLink.delete(id);
            }
        });
    }

    if(devices){
        Object.keys(devices).forEach(id=>{
            Device.insertOrUpdate({data: devices[id]});
        });
    }

    if(chains){
        Object.keys(chains).forEach(sentinelAddress=>{
            CurrentBlock.insertOrUpdate({data:{
                    address: sentinelAddress,
                    chain_id: chains[sentinelAddress].chainId,
                    block_hash: chains[sentinelAddress].blockHash
            }});
        });
    }

    if(blocks){
        Object.keys(blocks).forEach(hash=>{
            let block = blocks[hash];

            Block.insert({data: {
                    block_hash: hash,
                    miner_address: block.sentinelAddress,
                    previous_block_hash: block.previousBlockHash,
                    index: block.index,
                    chain_id: block.chainId,
                    timestamp: block.timestamp,
                    nonce: block.nonce,
            }});

            DarkPool.delete((hx) => {
                return hx.chain_id === block.chainId;
            });

            block.hxs.forEach(hx=>{
                Hx.insert({data:{
                    hx: hx,
                    block_hash: hash,
                    chain_id: block.chainId
                }});
            });

            block.previous_block_hash = block.previousBlockHash;
            let confirmations = block.chainId === 'serenity_control_chain' ? Settings.blockchain.controlChain.requiredConfirmations : Settings.blockchain.subChain.requiredConfirmations;
            let parentBlock = getParentBlock(block, confirmations);
            while(parentBlock && !parentBlock.confirmed){
                confirmBlock(parentBlock);
                parentBlock = getParentBlock(parentBlock, 1);
            }
        });
    }

    if(darkPools){
        Object.keys(darkPools).forEach(hx=>{
            DarkPool.insertOrUpdate({data:{
                    hx: hx,
                    address: darkPools[hx].address,
                    chain_id: darkPools[hx].chainId
            }});
        });
    }

    if(fingerprints){
        Object.keys(fingerprints).forEach(fingerprint=>{
            let f = fingerprints[fingerprint].fingerprint;
            if(f){
                Fingerprint.insertOrUpdate({data:{
                        hash: f.hash,
                        sentinel_address: f.sentinelAddress,
                        device_ip: f.deviceIp,
                        endpoint_ip: f.remote,
                        protocol: f.protocol,
                        port: f.port,
                        verdict: f.verdict,
                        timestamp: new Date().getTime()
                    }});

                Endpoint.insert({data:{
                        ip: f.remote
                    }});
            }
        });
    }

    if(firewallEvents){
        Object.keys(firewallEvents).forEach(address=>{
           FirewallEvent.insert({data:{
                   address: address,
                   allow: firewallEvents[address].allow,
                   deny: firewallEvents[address].deny,
                   timestamp: new Date().getTime()
           }});
        });
    }
});

function getParentBlock(child, generation) {
    let parent = Block.query().with('hxs').find(child.previous_block_hash);
    if (parent) {
        generation = generation - 1;
        if (generation > 0) {
            return getParentBlock(parent, generation);
        } else {
            return parent;
        }
    } else {
        return null;
    }
}

function confirmBlock(block){
    Block.update({
        data: {
            block_hash: block.block_hash,
            confirmed: true
        }
    });

    block.hxs.forEach(hx => {
        if (hx && !hx.confirmed){
            Hx.update({
                data: {
                    hx: hx.hx,
                    block_hash: block.block_hash,
                    confirmed: true,
                }
            });
        }
    });
}

export default socket;
