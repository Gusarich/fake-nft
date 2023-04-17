import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type NFTItemConfig = {
    owner: Address;
    content: Cell;
};

export function NFTItemConfigToCell(config: NFTItemConfig): Cell {
    return beginCell().storeAddress(config.owner).storeRef(config.content).endCell();
}

export class NFTItem implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NFTItem(address);
    }

    static createFromConfig(config: NFTItemConfig, code: Cell, workchain = 0) {
        const data = NFTItemConfigToCell(config);
        const init = { code, data };
        return new NFTItem(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
