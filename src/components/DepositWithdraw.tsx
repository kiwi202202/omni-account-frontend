import React, { useState } from "react";
import { Box, Button, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEthereum } from "../contexts/EthereumContext";

interface DepositWithdrawProps {
  aaContractAddress: string;
  abstractAccountABI: any[];
}

const DepositWithdraw: React.FC<DepositWithdrawProps> = ({
  aaContractAddress,
  abstractAccountABI,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const { provider, signer } = useEthereum();

  const handleDeposit = async () => {
    if (!amount) {
      setStatus("Please input AA deposit amount");
      return;
    }

    if (!signer) {
      setStatus("Wallet not connected");
      return;
    }

    try {
      const tx = await signer.sendTransaction({
        to: aaContractAddress,
        value: ethers.parseEther(amount),
      });
      setStatus("Handling transaction...");
      await tx.wait();
      setStatus("Deposit successful");
      console.log("Deposit successful");
    } catch (error: any) {
      console.error("Deposit failed:", error);
      setStatus(`Deposit failed: ${error.message}`);
    }
  };

  const handleWithdraw = async () => {
    if (!amount) {
      setStatus("Please input AA withdraw amount");
      return;
    }

    if (!signer || !provider) {
      setStatus("Wallet not connected");
      return;
    }

    try {
      const contract = new ethers.Contract(
        aaContractAddress,
        abstractAccountABI,
        signer
      );

      const tx = await contract.withdraw(ethers.parseEther(amount));
      setStatus("Withdrawing...");
      await tx.wait();
      setStatus("Withdrawal successful");
      console.log("Withdrawal successful");
    } catch (error: any) {
      console.error("Withdrawal failed:", error);
      setStatus(`Withdrawal failed: ${error.message}`);
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
        <Input
          placeholder="Please enter amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button width="200px" onClick={handleDeposit} colorScheme="green">
          Deposit
        </Button>
        <Button width="200px" onClick={handleWithdraw} colorScheme="red">
          Withdraw
        </Button>
        {status && <Text mt={2}>{status}</Text>}
      </Stack>
    </Box>
  );
};

export default DepositWithdraw;
