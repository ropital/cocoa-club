import { useToast } from '@chakra-ui/react'
import { CHAIN_ID } from 'src/constants/chainIds'
import { Contract, ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { getNftContract, getViewNftContract } from 'src/utils/getContract'
import { checkMetaMaskInstalled } from 'src/utils/metamask'

export type UseWalletReturns = {
  provider?: ethers.providers.Web3Provider
  signer?: ethers.providers.JsonRpcSigner
  accountAddress?: string
  nftContract?: Contract
  viewNftContract?: Contract
  isConnected: boolean
  isCorrectChain: boolean
  requestToConnect: () => Promise<void>
  requestToChangeNetwork: () => Promise<void>
}

export const useWallet = (): UseWalletReturns => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>()
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>()
  const toast = useToast()

  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isCorrectChain, setIsCorrectChain] = useState<boolean>(true)
  const [accountAddress, setAccountAddress] = useState<string>()
  const [nftContract, setNftContract] = useState<Contract>()
  const [viewNftContract, setViewNftContract] = useState<Contract>()

  useEffect(() => {
    init()

    window.ethereum.on('accountsChanged', function (accounts: string[]) {
      if (accounts.length) {
        setAccountAddress(accounts[0])
      } else {
        setAccountAddress('')
        setIsConnected(false)
      }
    })

    window.ethereum.on('networkChanged', function () {
      location.reload()
    })
  }, [])

  useEffect(() => {
    setContract()
  }, [signer])

  const init = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    if (!checkMetaMaskInstalled()) {
      alert('Please install metamask')
    }

    const accounts = await provider.listAccounts()
    if (accounts.length) {
      setIsConnected(true)
      setAccountAddress(accounts[0])
    }

    if (Number(window.ethereum.networkVersion) !== parseInt(CHAIN_ID, 16)) {
      setIsCorrectChain(false)
    }

    const signer = provider.getSigner(0)
    setSigner(signer)

    const viewNftContract = await getViewNftContract(provider)
    setViewNftContract(viewNftContract)
  }

  const setContract = async () => {
    if (!signer) return

    const nftContract = await getNftContract(signer)
    setNftContract(nftContract)
  }

  const requestToConnect = async () => {
    if (!provider) throw new Error('Provider is not initialized')

    const accounts = await provider.send('eth_requestAccounts', [])
    if (accounts.length) {
      setAccountAddress(accounts[0])
      setIsConnected(true)
    } else {
      setIsConnected(false)
    }
  }

  const requestToChangeNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN_ID }] // chainId must be in hexadecimal numbers
      })
      setIsCorrectChain(true)
      toast({
        status: 'success',
        title: 'Successfully changed network'
      })
    } catch (error) {
      toast({
        status: 'error',
        title: 'Network change failed'
      })
    }
  }

  return {
    accountAddress,
    provider,
    viewNftContract,
    nftContract,
    signer,
    isConnected,
    isCorrectChain,
    requestToConnect,
    requestToChangeNetwork
  }
}
