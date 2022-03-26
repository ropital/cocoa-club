import { useWallet, UseWalletReturns } from 'src/libs/hooks/useWallet'
import { createContext, FC, useContext } from 'react'

type WalletContextType = UseWalletReturns

export const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  isCorrectChain: true,
  requestToConnect: () => {
    throw new Error('requestToConnect function is not initialized')
  },
  requestToChangeNetwork: () => {
    throw new Error('requestToChangeNetwork function is not initialized')
  }
})

export const useWalletContext = () => useContext(WalletContext)

export const WalletProvider: FC = ({ children }) => {
  const wallet = useWallet()

  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
}
