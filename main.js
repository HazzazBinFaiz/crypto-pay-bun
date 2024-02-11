import { createWeb3Modal, defaultConfig } from '@web3modal/ethers';
import { BrowserProvider, Contract, formatUnits } from 'ethers'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '02952a7bf24b737d860749e4f41bd3e7'

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

// 3. Create modal
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'http://localhost:3000', // origin must match your domain & subdomain
  // icons: ['https://avatars.mywebsite.com/']
}

// const openNetworkModalBtn = document.getElementById('open-network-modal')
// openConnectModalBtn.addEventListener('click', () => modal.open())
// openNetworkModalBtn.addEventListener('click', () => modal.open({ view: 'Networks' }))

import Alpine from 'alpinejs'
 
window.Alpine = Alpine
 

Alpine.data('payData', () => {
  return {
    tab: 1,
    modal: null,
    provider: null,
    init() {
      this.modal = createWeb3Modal({
        ethersConfig: defaultConfig({ metadata }),
        chains: [mainnet],
        projectId,
        enableAnalytics: false
      });
      this.modal.subscribeProvider(({ provider, providerType, address, error, chainId, isConnected }) => {
        this.provider = this.modal.getWalletProvider();
        console.log({
          provider, providerType, address, error, chainId, isConnected
        })
      })
    }
  }
})

Alpine.start()