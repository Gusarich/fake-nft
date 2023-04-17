import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { NFTItem } from '../wrappers/NFTItem';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('NFTItem', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('NFTItem');
    });

    let blockchain: Blockchain;
    let NFTItem: SandboxContract<NFTItem>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        NFTItem = blockchain.openContract(NFTItem.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await NFTItem.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: NFTItem.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and NFTItem are ready to use
    });
});
