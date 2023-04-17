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
    let nFTItem: SandboxContract<NFTItem>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        nFTItem = blockchain.openContract(NFTItem.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await nFTItem.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nFTItem.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and nFTItem are ready to use
    });
});
