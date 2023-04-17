import { Address, toNano } from 'ton-core';
import { NFTItem } from '../wrappers/NFTItem';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const nft = provider.open(
        NFTItem.createFromConfig(
            {
                owner: Address.parse('EQBKgXCNLPexWhs2L79kiARR1phGH1LwXxRbNsCFF9doc2lN'),
            },
            await compile('NFTItem')
        )
    );

    await nft.sendDeploy(provider.sender(), toNano('0.01'));

    await provider.waitForDeploy(nft.address);
}
