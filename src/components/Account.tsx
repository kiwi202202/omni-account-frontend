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
} from "@chakra-ui/react";
import { AccountDetails } from "../types/Account";

const fetchAccountDetails = async (
  address: string
): Promise<AccountDetails> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockData: AccountDetails = {
    balance: "1.2345",
    nonce: 42,
    history: [
      {
        hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        to: "0x1234567890abcdef1234567890abcdef12345678",
        from: "0xabcdef1234567890abcdef1234567890abcdef1234",
        value: "0.5",
        timestamp: "2024-08-31 10:00:00",
      },
      {
        hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        to: "0xabcdef1234567890abcdef1234567890abcdef1234",
        from: "0x1234567890abcdef1234567890abcdef12345678",
        value: "0.75",
        timestamp: "2024-08-30 14:30:00",
      },
      {
        hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        to: "0x1234567890abcdef1234567890abcdef12345678",
        from: "0xabcdef1234567890abcdef1234567890abcdef1234",
        value: "1.0",
        timestamp: "2024-08-29 09:15:00",
      },
    ],
  };

  return mockData;
};

const Account: React.FC<{ address: string }> = ({ address }) => {
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(
    null
  );

  useEffect(() => {
    fetchAccountDetails(address).then(setAccountDetails);
  }, [address]);

  if (!accountDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box>
      <Stack spacing={4}>
        <Box>
          <Text fontWeight="bold">Balance:</Text>
          <Text>{accountDetails.balance} ETH</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Nonce:</Text>
          <Text>{accountDetails.nonce}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Transaction History:</Text>
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
