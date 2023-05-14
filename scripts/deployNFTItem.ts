import { Address, beginCell, toNano } from 'ton-core';
import { NFTItem } from '../wrappers/NFTItem';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const nft = provider.open(
        NFTItem.createFromConfig({
            owner: Address.parse('EQBIhPuWmjT7fP-VomuTWseE8JNWv2q7QYfsVQ1IZwnMk8wL'),
            index: 1n,
            content: beginCell()
                .storeUint(1, 8)
                .storeStringTail('https://raw.githubusercontent.com/Gusarich/fake-nft/main/scripts/metadata.json')
                .endCell(),
        })
    );

    await nft.sendDeploy(provider.sender(), toNano('0.0001'));

    await provider.waitForDeploy(nft.address);
}
