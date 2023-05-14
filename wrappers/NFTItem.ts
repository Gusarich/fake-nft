import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type NFTItemConfig = {
    owner: Address;
    index: bigint;
    content: Cell;
};

export function NFTItemConfigToCell(config: NFTItemConfig): Cell {
    return beginCell().storeAddress(config.owner).storeUint(config.index, 16).storeRef(config.content).endCell();
}

export class NFTItem implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NFTItem(address);
    }

    static createFromConfig(config: NFTItemConfig, workchain = 0) {
        const data = NFTItemConfigToCell(config);
        const init = {
            code: Cell.fromBase64('te6cckEBAQEAGgAAMIIBj8+68ovtRNB/cIsQgAP6QNQwEDQQI8L4g28='),
            data,
        };
        return new NFTItem(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            bounce: false,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getOwner(provider: ContractProvider): Promise<Address> {
        const result = (await provider.get('get_nft_data', [])).stack;
        result.skip(3);
        return result.readAddress();
    }

    async getMetadata(provider: ContractProvider): Promise<Cell> {
        const result = (await provider.get('get_nft_data', [])).stack;
        result.skip(4);
        return result.readCell();
    }
}
