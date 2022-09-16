import BloctoSDK from '@blocto/sdk'

export const bloctoSDK = new BloctoSDK({
    solana: {
        net: 'devnet',
    },
    
    appId: '34d9ae1f-6838-4eca-a41e-6e77392f5a94',
});