import React, { useState } from "react";
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
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
    <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" mt={4}>
      <Stack spacing={4}>
        <Input
          placeholder="Please enter amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button onClick={handleDeposit} colorScheme="green">
          Deposit
        </Button>
        <Button onClick={handleWithdraw} colorScheme="red">
          Withdraw
        </Button>
        {status && <Text mt={2}>{status}</Text>}
      </Stack>
    </Box>
  );
};

export default DepositWithdraw;
