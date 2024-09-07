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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setAccountDetails } from "../features/account/accountSlice";

const Account: React.FC = () => {
  // const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
  //   null
  // );
  const { chainId, aaContractAddress, error } = useEthereum();
  const toast = useToast();
  const accountDetails = useSelector(
    (state: RootState) => state.account.accountDetails
  );

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
