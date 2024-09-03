import { useEffect } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import Account from "../components/Account";
import DepositWithdraw from "../components/DepositWithdraw";
import { useEthereum } from "../contexts/EthereumContext";

import AbstractAccountJSON from "../abis/TicketManager.json";

const AbstractAccountABI = AbstractAccountJSON.abi;
const AccountPage: React.FC = () => {
  const { fetchAAContractAddress, aaContractAddress, error } = useEthereum();

  useEffect(() => {
    const init = async () => {
      await fetchAAContractAddress();
    };
    init();
  }, [fetchAAContractAddress]);

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!aaContractAddress) {
    return <Text>Loading AA Contract Address...</Text>;
  }

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
        <Account address={aaContractAddress} />
      </Box>
      <DepositWithdraw
        aaContractAddress={aaContractAddress}
        abstractAccountABI={AbstractAccountABI}
      />
    </Flex>
  );
};

export default AccountPage;
