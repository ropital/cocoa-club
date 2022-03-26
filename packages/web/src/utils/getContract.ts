import ERC721 from '@cocoa-club/contract/artifacts/contracts/CocoaNFT.sol/CocoaNFT.json'
import * as ethers from 'ethers'

export const getViewNftContract = async (provider: ethers.providers.Provider) => {
  const erc721 = await ERC721
  const contract = new ethers.Contract(process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '', erc721.abi, provider)
  return contract
}

export const getNftContract = async (signer: ethers.providers.JsonRpcSigner) => {
  const erc721 = await ERC721
  const contract = new ethers.Contract(process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '', erc721.abi, signer)
  return contract
}
