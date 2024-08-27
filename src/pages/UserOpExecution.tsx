import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEthereum } from "../contexts/EthereumContext";
import { UserOperation } from "../types/UserOperation";
import axios from "axios";
const { TypedDataEncoder } = ethers;

const UserOpExecution = () => {
  const { account, provider, signer } = useEthereum();
  const [userOp, setUserOp] = useState<UserOperation>({
    sender: account || "0x",
    nonce: 1,
    chainId: 1,
    initCode: "0x",
    callData: "0x",
    callGasLimit: 21000,
    verificationGasLimit: 21000,
    preVerificationGas: 10000,
    maxFeePerGas: 20000000000,
    maxPriorityFeePerGas: 1000000000,
    paymasterAndData: "0x",
  });
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserOp({ ...userOp, [name]: value });
  };

  const signAndSend = async () => {
    if (!signer) {
      toast({
        title: "Error",
        description: "No signer found. Please connect your wallet.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const domain = {
        name: "ZK-AA",
        version: "1.0",
        chainId: userOp.chainId,
        verifyingContract: userOp.sender,
      };

      const types = {
        UserOperation: [
          { name: "sender", type: "address" },
          { name: "nonce", type: "uint256" },
          { name: "chainId", type: "uint256" },
          { name: "initCode", type: "bytes" },
          { name: "callData", type: "bytes" },
          { name: "callGasLimit", type: "uint256" },
          { name: "verificationGasLimit", type: "uint256" },
          { name: "preVerificationGas", type: "uint256" },
          { name: "maxFeePerGas", type: "uint256" },
          { name: "maxPriorityFeePerGas", type: "uint256" },
          { name: "paymasterAndData", type: "bytes" },
        ],
      };

      const value = {
        sender: userOp.sender,
        nonce: userOp.nonce,
        chainId: userOp.chainId,
        initCode: userOp.initCode,
        callData: userOp.callData,
        callGasLimit: userOp.callGasLimit,
        verificationGasLimit: userOp.verificationGasLimit,
        preVerificationGas: userOp.preVerificationGas,
        maxFeePerGas: userOp.maxFeePerGas,
        maxPriorityFeePerGas: userOp.maxPriorityFeePerGas,
        paymasterAndData: userOp.paymasterAndData,
      };

      const signature = await signer.signTypedData(domain, types, value);

      const signedUserOp = { ...userOp, signature };
      const rpcUrl = process.env.REACT_APP_BACKEND_RPC_URL!;

      console.log("signedUserOp: ", signedUserOp);
      //     console.log("encodedUserOp Bytes: ", ethers.getBytes(encodedUserOp));

      const recoveredAddress = ethers.verifyTypedData(
        domain,
        types,
        value,
        signature
      );

      console.log("Recovery Address:", recoveredAddress);
      const hash = TypedDataEncoder.hash(domain, types, value);
      console.log("Hash Message: ", hash);

      await axios.post(rpcUrl, signedUserOp, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast({
        title: "Success",
        description: "UserOperation signed and sent successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to sign and send UserOperation", error);
      toast({
        title: "Error",
        description: "Failed to sign and send UserOperation.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="500px" mx="auto" mt="5">
      <Text fontSize="2xl" mb="4">
        UserOp Execution
      </Text>
      <FormControl mb="3">
        <FormLabel>Sender</FormLabel>
        <Input name="sender" value={userOp.sender} onChange={handleChange} />
      </FormControl>
      <FormControl mb="3">
        <FormLabel>Nonce</FormLabel>
        <Input
          name="nonce"
          type="number"
          value={userOp.nonce}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb="3">
        <FormLabel>Chain ID</FormLabel>
        <Input
          name="chainId"
          type="number"
          value={userOp.chainId}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb="3">
        <FormLabel>initCode</FormLabel>
        <Input
          name="initCode"
          value={userOp.initCode}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb="3">
        <FormLabel>callData</FormLabel>
        <Input
          name="callData"
          value={userOp.callData}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb="3">
        <FormLabel>callGasLimit</FormLabel>
        <Input
          name="callGasLimit"
          type="number"
          value={userOp.callGasLimit}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb="3">
        <FormLabel>verificationGasLimit</FormLabel>
        <Input
          name="verificationGasLimit"
          type="number"
          value={userOp.verificationGasLimit}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb="3">
        <FormLabel>preVerificationGas</FormLabel>
        <Input
          name="preVerificationGas"
          type="number"
          value={userOp.preVerificationGas}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb="3">
        <FormLabel>maxFeePerGas</FormLabel>
        <Input
          name="maxFeePerGas"
          type="number"
          value={userOp.maxFeePerGas}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb="3">
        <FormLabel>maxPriorityFeePerGas</FormLabel>
        <Input
          name="maxPriorityFeePerGas"
          type="number"
          value={userOp.maxPriorityFeePerGas}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl mb="3">
        <FormLabel>paymasterAndData</FormLabel>
        <Input
          name="paymasterAndData"
          value={userOp.paymasterAndData}
          onChange={handleChange}
        />
      </FormControl>
      <Button colorScheme="teal" onClick={signAndSend}>
        Sign and Send UserOp
      </Button>
    </Box>
  );
};

export default UserOpExecution;
