import { useState } from "react";
import { useEthereum } from "../contexts/EthereumContext";
import { ethers } from "ethers";
import TicketManagerJson from "../abis/TicketManager.json";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  useToast,
  Select,
  Flex,
} from "@chakra-ui/react";

const TicketManagerABI = TicketManagerJson.abi;

const TicketInteractionPage = () => {
  const { chainId, switchNetwork, signer } = useEthereum();
  const [amount, setAmount] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  // selectedNetwork is only used for network switch, chainId is used for contract interaction.
  const [selectedNetwork, setSelectedNetwork] = useState<string>("11155111");
  const toast = useToast();

  const getTicketManagerContract = () => {
    if (!signer || !chainId) {
      throw new Error(
        "No signer or chainId found. Please connect to MetaMask."
      );
    }

    const contractAddress = process.env[`REACT_APP_TICKET_MANAGER_${chainId}`];
    if (!contractAddress) {
      throw new Error(
        "No TicketManager contract address found for the current chain."
      );
    }
    console.log("contractAddress: ", contractAddress);
    return new ethers.Contract(contractAddress, TicketManagerABI, signer);
  };

  const handleTransaction = async (type: "deposit" | "withdraw") => {
    try {
      const contract = getTicketManagerContract();
      const amountInWei = ethers.parseEther(amount);

      console.log("AA address: ", account);
      if (!ethers.isAddress(account)) {
        throw new Error("Invalid Ethereum address");
      }
      const normalizedAccount = ethers.getAddress(account);

      const tx =
        type === "deposit"
          ? await contract.addDepositTicket(normalizedAccount, amountInWei, {
              value: amountInWei,
            })
          : await contract.addWithdrawTicket(normalizedAccount, amountInWei);

      await tx.wait();
      toast({
        title: `${type === "deposit" ? "Deposit" : "Withdraw"} successful`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: "Transaction failed",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeposit = () => handleTransaction("deposit");
  const handleWithdraw = () => handleTransaction("withdraw");

  const handleNetworkSwitch = async () => {
    // switchNetwork will handle internal error
    await switchNetwork(selectedNetwork);
    toast({
      title: `Switched to network ${selectedNetwork}`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex direction="column" align="center" p="5">
      <Box
        width="1280px"
        border="1.5px solid black"
        display="flex"
        flexDirection="column"
        alignItems="left"
        justifyContent="center"
        marginBottom="20px"
        marginTop="20px"
        borderRadius="0"
        bg="white"
        padding={8}
        boxShadow="sm"
        textAlign="left"
      >
        <Text variant="title" mb={6} textAlign="start">
          Ticket Interaction
        </Text>
        <VStack spacing={4} align="stretch">
          <Select
            placeholder="Select Network"
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            size="lg"
          >
            <option value="11155111">Sepolia (11155111)</option>
            <option value="1101">Polygon zkEVM (1101)</option>
            <option value="42161">Arbitrum (42161)</option>
            <option value="31337">Hardhat Local Testnet (31337)</option>
          </Select>

          <Button
            onClick={handleNetworkSwitch}
            variant="solid"
            size="lg"
            width="200px"
          >
            Switch Network
          </Button>

          <Input
            placeholder="Address"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            size="lg"
            focusBorderColor="brand.500"
          />
          <Input
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            size="lg"
            focusBorderColor="brand.500"
          />
          <Button
            onClick={handleDeposit}
            variant="solid"
            size="lg"
            width="200px"
          >
            Deposit Ticket
          </Button>
          <Button
            onClick={handleWithdraw}
            variant="solid"
            size="lg"
            width="200px"
          >
            Withdraw Ticket
          </Button>

          {chainId && (
            <Text textAlign="center">Connected to Chain ID: {chainId}</Text>
          )}
        </VStack>
      </Box>
    </Flex>
  );
};

export default TicketInteractionPage;
