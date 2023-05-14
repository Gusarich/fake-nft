import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Address, beginCell, toNano } from 'ton-core';
import { NFTItem } from '../wrappers/NFTItem';
import '@ton-community/test-utils';
import { randomAddress } from '@ton-community/test-utils';

describe('NFTItem', () => {
    let blockchain: Blockchain;
    let nft: SandboxContract<NFTItem>;
    let ownerAddress: Address;

    beforeEach(async () => {
        ownerAddress = randomAddress();
        blockchain = await Blockchain.create();
        nft = blockchain.openContract(
            NFTItem.createFromConfig({
                owner: ownerAddress,
                index: 0n,
                content: beginCell().storeUint(1, 8).storeStringTail('https://test.com/1.json').endCell(),
            })
        );
        const deployer = await blockchain.treasury('deployer');
        const deployResult = await nft.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nft.address,
            deploy: true,
        });
    });

    it('should deploy', async () => {});

    it('should return correct data', async () => {
        expect(await nft.getOwner()).toEqualAddress(ownerAddress);
        expect(await nft.getMetadata()).toEqualCell(
            beginCell().storeUint(1, 8).storeStringTail('https://test.com/1.json').endCell()
        );
    });
});
