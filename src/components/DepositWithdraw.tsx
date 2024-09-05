import React, { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEthereum } from "../contexts/EthereumContext";
import AbstractAccountJSON from "../abis/TicketManager.json";

const abstractAccountABI = AbstractAccountJSON.abi;

const DepositWithdraw: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const toast = useToast();

  const { aaContractAddress, chainId, provider, signer } = useEthereum();

  if (!aaContractAddress) {
    return (
      <Text mx={20} variant="title">
        Loading AA Contract Address...
      </Text>
    );
  }

  const handleDeposit = async () => {
    if (!amount) {
      toast({
        title: "Please input AA deposit amount",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!signer) {
      toast({
        title: "Wallet not connected",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const tx = await signer.sendTransaction({
        to: aaContractAddress,
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      toast({
        title: "Deposit successful",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      console.log("Deposit successful");
    } catch (error: any) {
      console.error("Deposit failed:", error);
      toast({
        title: `Deposit failed: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleWithdraw = async () => {
    if (!amount) {
      toast({
        title: "Please input AA withdraw amount",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!signer || !provider) {
      toast({
        title: "Wallet not connected",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const contract = new ethers.Contract(
        aaContractAddress,
        abstractAccountABI,
        signer
      );

      const tx = await contract.withdraw(ethers.parseEther(amount));
      await tx.wait();
      toast({
        title: "Withdrawal successful",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      console.log("Withdrawal successful");
    } catch (error: any) {
      console.error("Withdrawal failed:", error);
      toast({
        title: `Withdrawal failed: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      mx="auto"
      width="1280px"
      marginTop="20px"
      borderRadius="0"
      borderWidth="1.5px"
      borderColor="black"
      bg="white"
      padding={6}
    >
      <Stack spacing={4}>
        <HStack>
          <Text variant="title">Omni Account: </Text>
          <Text variant="description">{aaContractAddress}</Text>
        </HStack>
        <HStack>
          <Text variant="title">Chain Id: </Text>
          <Text variant="description">{chainId}</Text>
        </HStack>
        <Input
          placeholder="Please enter amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button width="200px" onClick={handleDeposit}>
          Deposit
        </Button>
        <Button width="200px" onClick={handleWithdraw}>
          Withdraw
        </Button>
      </Stack>
    </Box>
  );
};

export default DepositWithdraw;
