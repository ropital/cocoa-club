import type { NextPage } from 'next'
import Head from 'next/head'
import {
  Button,
  Text,
  Input,
  Heading,
  Box,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  useToast,
  CloseButton
} from '@chakra-ui/react'
import { useWalletContext } from 'src/context/WalletProvider'
import { ChangeEventHandler, useEffect, useState } from 'react'
import { ethers } from 'ethers'

const Home: NextPage = () => {
  const wallet = useWalletContext()
  const toast = useToast()
  const [amount, setAmount] = useState(1)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!wallet.isCorrectChain) {
      toast({
        status: 'warning',
        title: 'Please change network',
        position: 'bottom-right',
        duration: null,
        isClosable: true,
        render: () => {
          return (
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle mr={2}>Please change your network</AlertTitle>
              <Button onClick={wallet.requestToChangeNetwork}>Change network</Button>
            </Alert>
          )
        }
      })
    }
  }, [wallet.isCorrectChain])

  const mint = async () => {
    if (!wallet.nftContract) return

    if (!wallet.accountAddress) {
      toast({
        status: 'error',
        title: 'Please connect to wallet'
      })
      return
    }

    try {
      setLoading(true)
      const tx = await wallet.nftContract.mint(amount, {
        value: ethers.utils.parseEther(`${amount * 0.01}`)
      })
      await tx.wait()
      toast({
        status: 'success',
        title: 'Mint is now complete🎉'
      })
    } catch (error) {
      console.error(error)
      toast({
        status: 'error',
        title: 'Mint failed.'
      })
    } finally {
      setLoading(false)
    }
  }

  const onChange: ChangeEventHandler<HTMLInputElement> = event => {
    const value = Number(event.target.value)
    if (value > 5) {
      setError('Maximum number of mints is only 5')
    } else if (value < 1) {
      setError('Please enter a value greater than 1')
    } else {
      setError('')
    }

    setAmount(Number(event.target.value))
  }

  return (
    <>
      <Head>
        <title>Cocoa Club</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box bgColor="blackAlpha.800" h="100vh">
        <Flex justifyContent="right" pr="10px" pt="10px">
          {!wallet.accountAddress && (
            <Button onClick={wallet.requestToConnect} colorScheme="whiteAlpha" variant="outline">
              Connect Wallet
            </Button>
          )}
          {wallet.accountAddress && (
            <Text fontWeight="bold" color="white">
              {wallet.accountAddress}
            </Text>
          )}
        </Flex>

        <Box
          w="500px"
          bgColor="black"
          borderRadius="8px"
          textAlign="center"
          px="20px"
          py="20px"
          margin="0 auto"
          mt="200px"
        >
          <Heading as="h1" color="white">
            Mint NFT
          </Heading>
          <Text color="gray.300">of NFT are minted</Text>
          <Input
            placeholder="Amount"
            type="number"
            mt="20px"
            color="white"
            max="5"
            min="1"
            value={amount}
            onChange={onChange}
          />
          <Text color="white" fontWeight="bold" mt="20px">
            {amount * 0.01}ETH
          </Text>
          {error !== '' && <Text color="red">{error}</Text>}
          <Button
            w="100%"
            colorScheme="pink"
            mt="20px"
            onClick={mint}
            isLoading={isLoading}
            disabled={isLoading || error !== ''}
          >
            Mint
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default Home
