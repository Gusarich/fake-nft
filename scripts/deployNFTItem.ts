import { toNano } from 'ton-core';
import { NFTItem } from '../wrappers/NFTItem';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const nFTItem = provider.open(NFTItem.createFromConfig({}, await compile('NFTItem')));

    await nFTItem.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(nFTItem.address);

    // run methods on `nFTItem`
}
