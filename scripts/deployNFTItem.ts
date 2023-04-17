import { Address, toNano } from 'ton-core';
import { NFTItem } from '../wrappers/NFTItem';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const nft = provider.open(
        NFTItem.createFromConfig(
            {
                owner: Address.parse('EQCRtBJh6Xw1OSr0OqHZ10ARHVcTaf1MIKxDaL1Y0HXagcEj'),
                index: 0n,
            },
            await compile('NFTItem')
        )
    );

    await nft.sendDeploy(provider.sender(), toNano('0.0007'));

    await provider.waitForDeploy(nft.address);
}
