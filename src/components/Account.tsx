import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Stack,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { AccountDetails } from "../types/Account";
import { useEthereum } from "../contexts/EthereumContext";
import axios from "axios";

const fetchAccountDetails = async (
  address: string,
  chainId: string
): Promise<AccountDetails> => {
  const rpcData = {
    jsonrpc: "2.0",
    method: "eth_getAccountInfo",
    params: [address, parseInt(chainId, 10)],
    // params: ["0xfd63ed0566a782ef57f559c6f5f9afece4866423", 11155111],
    id: 1,
  };

  try {
    const response = await axios.post(
      process.env.REACT_APP_BACKEND_RPC_URL!,
      rpcData
    );

    if (response.data && response.data.result) {
      const result = response.data.result;

      const accountDetails: AccountDetails = {
        balance: result.Balance,
        nonce: result.Nonce,
        history: [],
      };

      return accountDetails;
    } else {
      throw new Error("Failed to get Omni Account Info");
    }
  } catch (error) {
    console.error("Failed to send getAccountInfo request to backend:", error);
    throw new Error("Failed to get Omni Account Info");
  }
};

const Account: React.FC = () => {
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null
  );
  const { chainId, aaContractAddress, error } = useEthereum();

  const toast = useToast();

  useEffect(() => {
    if (aaContractAddress && chainId) {
      fetchAccountDetails(aaContractAddress, chainId)
        .then(setAccountDetails)
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to fetch account details.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  }, [aaContractAddress, chainId]);

  if (!accountDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box>
      <Stack spacing={4}>
        <HStack>
          <Text variant="title">Omni Account: </Text>
          <Text variant="description">{aaContractAddress}</Text>
        </HStack>
        <HStack>
          <Text variant="title">Chain Id: </Text>
          <Text variant="description">{chainId}</Text>
        </HStack>
        <HStack>
          <Text variant="title">Gas Balance: </Text>
          <Text variant="description">{accountDetails.balance} ETH</Text>
        </HStack>
        <HStack>
          <Text variant="title">Nonce:</Text>
          <Text variant="description">{accountDetails.nonce}</Text>
        </HStack>
        <Box>
          <Text variant="title">Transaction History</Text>
          <Table>
            <Thead>
              <Tr>
                <Th>Tx Hash</Th>
                <Th>From</Th>
                <Th>To</Th>
                <Th>Value</Th>
                <Th>Timestamp</Th>
              </Tr>
            </Thead>
            <Tbody>
              {accountDetails.history.map((tx, index) => (
                <Tr key={index}>
                  <Td>{tx.hash}</Td>
                  <Td>{tx.from}</Td>
                  <Td>{tx.to}</Td>
                  <Td>{tx.value} ETH</Td>
                  <Td>{tx.timestamp}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Stack>
    </Box>
  );
};

export default Account;
