import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { NFTItem } from '../wrappers/NFTItem';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { randomAddress } from '@ton-community/test-utils';

describe('NFTItem', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('NFTItem');
    });

    let blockchain: Blockchain;
    let nft: SandboxContract<NFTItem>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        nft = blockchain.openContract(
            NFTItem.createFromConfig(
                {
                    owner: randomAddress(),
                },
                code
            )
        );
    });

    it('should deploy', async () => {
        const deployer = await blockchain.treasury('deployer');
        const deployResult = await nft.sendDeploy(deployer.getSender(), toNano('0.05'));
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: nft.address,
            deploy: true,
            success: true,
        });
    });
});
