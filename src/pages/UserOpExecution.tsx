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
import { BigNumberish, ethers } from "ethers";
import { useEthereum } from "../contexts/EthereumContext";
import { UserOperation } from "../types/UserOperation";
import axios from "axios";
import AccountABI from "../abis/test.json";
import SimpleAccountFactoryABI from "../abis/SimpleAccountFactory.json";
import CounterJSON from "../abis/Counter.json";
import { useSelector } from "react-redux";
import { RootState } from "../store";
const counterABI = CounterJSON.abi;
const { TypedDataEncoder } = ethers;

const UserOpExecution = () => {
  const {
    account,
    aaContractAddress,
    provider,
    signer,
    chainId,
    // fetchAAContractAddress,
  } = useEthereum();
  const [userOp, setUserOp] = useState<UserOperation>({
    sender: account || "0x",
    nonce: 1,
    chainId: 11155111,
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
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("0.01");
  const accountDetails = useSelector(
    (state: RootState) => state.account.accountDetails
  );

  const account_contract = new ethers.Contract(
    aaContractAddress || "0x93d53d2d8f0d623c5cbe46daa818177a450bd9f7",
    AccountABI,
    provider
  );

  const counter_contract = new ethers.Contract(
    process.env[`REACT_APP_COUNTER_11155111`]!,
    counterABI,
    provider
  );

  const createAccountSample = async () => {
    // const ethValue = ethers.parseEther("0.01"); // 10^16 wei
    // const entryPointAddress = "0x71f57F8A220FbcF6AaCdf501912C2ad9b90CA842";
    // const incrementCallData = "0x";
    if (!account) {
      toast({
        title: "Error",
        description: `Wallet Not Connected.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const owner = account;
    const salt = 0;

    const accountFactoryAddress =
      process.env[`REACT_APP_ACCOUNT_FACTORY_${chainId}`];
    if (!accountFactoryAddress) {
      toast({
        title: "Error",
        description: `Account factory is not available for chainId ${userOp.chainId}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    console.log("Factory Address: ", accountFactoryAddress);

    const account_factory = new ethers.Contract(
      accountFactoryAddress,
      SimpleAccountFactoryABI,
      signer
    );

    // directly create Omni Account by contract interaction
    await createAccountAndGetAddress(account_factory, owner, salt);

    // const preInitCode = account_factory.interface.encodeFunctionData(
    //   "createAccount",
    //   [owner, salt]
    // );

    // const addressHex = ethers.hexlify(accountFactoryAddress);
    // const initCode = accountFactoryAddress + preInitCode.slice(2);

    // account_factory.createAccount()
    // let initAccount: string = await account_factory.getAccountAddress(
    //   owner,
    //   salt
    // );

    // const sample: UserOperation = {
    //   sender: initAccount,
    //   nonce: 1,
    //   chainId: 11155111,
    //   initCode: initCode,
    //   callData: "0x",
    //   callGasLimit: 35000,
    //   verificationGasLimit: 250000,
    //   preVerificationGas: 17000,
    //   maxFeePerGas: 30000000000,
    //   maxPriorityFeePerGas: 2500000000,
    //   paymasterAndData: "0x",
    // };
    // setUserOp(sample);

    // await fetchAAContractAddress(owner);
  };

  async function createAccountAndGetAddress(
    account_factory: ethers.Contract,
    owner: string,
    salt: BigNumberish
  ) {
    // Assume account_factory is an instance of a contract with the createAccount method
    try {
      let tx = await account_factory.createAccount(owner, salt);

      // Wait for the transaction to be mined
      let receipt = await tx.wait();
      // Extract the address from the transaction receipt
      // The address should be in receipt.events[0].args[0] or similar based on contract's output
      // let initAccount = receipt.events[0].args[0];
    } catch {
      toast({
        title: "Error",
        description: `Failed to create Omni Account.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  }

  const transferSample = () => {
    const ethValue = ethers.parseEther(amount);
    // const entryPointAddress = process.env.REACT_APP_ENTRY_POINT_11155111!;
    const incrementCallData = "0x";

    const callData = account_contract.interface.encodeFunctionData("execute", [
      toAddress,
      ethValue,
      incrementCallData,
    ]);

    const new_nonce = (accountDetails?.nonce ?? 0) + 1;

    const sample: UserOperation = {
      sender: aaContractAddress || "0x",
      nonce: new_nonce,
      chainId: userOp.chainId,
      initCode: "0x",
      callData: callData,
      callGasLimit: 200000,
      verificationGasLimit: 270000,
      preVerificationGas: 170000,
      maxFeePerGas: 30000000000,
      maxPriorityFeePerGas: 2000000000,
      paymasterAndData: "0x",
    };
    setUserOp(sample);
  };

  const counterSample = () => {
    const ethValue = ethers.parseEther("0");
    const counterAddress = process.env[`REACT_APP_COUNTER_${userOp.chainId}`];
    const incrementCallData =
      counter_contract.interface.encodeFunctionData("increment");
    const callData = account_contract.interface.encodeFunctionData("execute", [
      counterAddress,
      ethValue,
      incrementCallData,
    ]);

    const new_nonce = (accountDetails?.nonce ?? 0) + 1;

    const sample: UserOperation = {
      sender: aaContractAddress || "0x",
      nonce: new_nonce,
      chainId: userOp.chainId,
      initCode: "0x",
      callData: callData,
      callGasLimit: 200000,
      verificationGasLimit: 270000,
      preVerificationGas: 170000,
      maxFeePerGas: 30000000000,
      maxPriorityFeePerGas: 2000000000,
      paymasterAndData: "0x",
    };
    setUserOp(sample);
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
        name: "OMNI-ACCOUNT",
        version: "1.0",
        chainId: 11155111,
        verifyingContract: process.env.REACT_APP_SEPOLIA_ENTRY_POINT!,
      };

      const types = {
        UserOperation: [
          { name: "sender", type: "address" },
          { name: "nonce", type: "uint256" },
          { name: "chainId", type: "uint64" },
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

      const formattedUserOp = {
        ...signedUserOp,
        nonce: `0x${signedUserOp.nonce.toString(16)}`,
        chainId: `0x${signedUserOp.chainId.toString(16)}`,
        callGasLimit: `0x${signedUserOp.callGasLimit.toString(16)}`,
        verificationGasLimit: `0x${signedUserOp.verificationGasLimit.toString(
          16
        )}`,
        preVerificationGas: `0x${signedUserOp.preVerificationGas.toString(16)}`,
        maxFeePerGas: `0x${signedUserOp.maxFeePerGas.toString(16)}`,
        maxPriorityFeePerGas: `0x${signedUserOp.maxPriorityFeePerGas.toString(
          16
        )}`,
      };

      console.log("formattedUserOp:");
      console.log(formattedUserOp);

      await axios.post(rpcUrl, {
        jsonrpc: "2.0",
        method: "eth_sendUserOperation",
        params: [formattedUserOp],
        id: 1,
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
            User Operation Submission
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
            <Button mb="4" onClick={createAccountSample}>
              Create Omni Account
            </Button>
            <Box>
              <Input
                placeholder="Recipient address"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                mb="4"
              />
              <Input
                placeholder="Amount in ETH"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                mb="4"
              />
              <Button mb="4" onClick={transferSample} width="100%">
                Transfer {amount} ETH
              </Button>
            </Box>

            {/* <Box> */}
            <Button mb="4" onClick={counterSample}>
              Trigger Counter on chain: {chainId}
            </Button>
            {/* </Box> */}

            <Button onClick={signAndSend}>Sign and Send UserOp</Button>
          </ButtonGroup>
        </Box>
      </Flex>
    </Flex>
  );
};

export default UserOpExecution;
