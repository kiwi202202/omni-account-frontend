import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
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

  const omniAccountSample: UserOperation = {
    sender: account || "0x",
    nonce: 2,
    chainId: 1,
    initCode: "0xYourOmniAccountInitCode",
    callData: "0xYourOmniAccountCallData",
    callGasLimit: 30000,
    verificationGasLimit: 25000,
    preVerificationGas: 15000,
    maxFeePerGas: 25000000000,
    maxPriorityFeePerGas: 2000000000,
    paymasterAndData: "0xYourPaymasterData",
  };

  const transferSample: UserOperation = {
    sender: account || "0x",
    nonce: 3,
    chainId: 1,
    initCode: "0xYourTransferInitCode",
    callData: "0xYourTransferCallData",
    callGasLimit: 35000,
    verificationGasLimit: 27000,
    preVerificationGas: 17000,
    maxFeePerGas: 30000000000,
    maxPriorityFeePerGas: 2500000000,
    paymasterAndData: "0xYourPaymasterData",
  };

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
    <Flex direction="column" align="center" p="5">
      <Flex
        p={8}
        width="1280px"
        border="1.5px solid black"
        borderRadius="0"
        mx="auto"
        marginTop="20px"
        marginBottom="20px"
        alignItems="flex-start"
        bg="white"
      >
        <Box width="700px">
          <Text variant="title" mb="4">
            UserOp Execution
          </Text>
          <FormControl mb="1">
            <FormLabel>Sender</FormLabel>
            <Input
              name="sender"
              value={userOp.sender}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb="1">
            <FormLabel>Nonce</FormLabel>
            <Input
              name="nonce"
              type="number"
              value={userOp.nonce}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb="1">
            <FormLabel>Chain ID</FormLabel>
            <Input
              name="chainId"
              type="number"
              value={userOp.chainId}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb="1">
            <FormLabel>initCode</FormLabel>
            <Input
              name="initCode"
              value={userOp.initCode}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb="1">
            <FormLabel>callData</FormLabel>
            <Input
              name="callData"
              value={userOp.callData}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb="1">
            <FormLabel>callGasLimit</FormLabel>
            <Input
              name="callGasLimit"
              type="number"
              value={userOp.callGasLimit}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb="1">
            <FormLabel>verificationGasLimit</FormLabel>
            <Input
              name="verificationGasLimit"
              type="number"
              value={userOp.verificationGasLimit}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb="1">
            <FormLabel>preVerificationGas</FormLabel>
            <Input
              name="preVerificationGas"
              type="number"
              value={userOp.preVerificationGas}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb="1">
            <FormLabel>maxFeePerGas</FormLabel>
            <Input
              name="maxFeePerGas"
              type="number"
              value={userOp.maxFeePerGas}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb="1">
            <FormLabel>maxPriorityFeePerGas</FormLabel>
            <Input
              name="maxPriorityFeePerGas"
              type="number"
              value={userOp.maxPriorityFeePerGas}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb="1">
            <FormLabel>paymasterAndData</FormLabel>
            <Input
              name="paymasterAndData"
              value={userOp.paymasterAndData}
              onChange={handleChange}
            />
          </FormControl>
        </Box>
        <Box ml="40" width="300px" mt="20">
          <ButtonGroup flexDir="column" spacing="0">
            <Button mb="4" onClick={() => setUserOp(omniAccountSample)}>
              Create AA Sample
            </Button>
            <Button mb="4" onClick={() => setUserOp(transferSample)}>
              Transfer Sample
            </Button>
            <Button onClick={signAndSend}>Sign and Send UserOp</Button>
          </ButtonGroup>
        </Box>
      </Flex>
    </Flex>
  );
};

export default UserOpExecution;
