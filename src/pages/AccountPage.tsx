import { useEffect } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import Account from "../components/Account";
import DepositWithdraw from "../components/DepositWithdraw";
import { useEthereum } from "../contexts/EthereumContext";

const AccountPage: React.FC = () => {
  const { account, aaContractAddress, chainId, error } = useEthereum();

  if (error) {
    return (
      <Text mx={20} variant="title">
        {error}
      </Text>
    );
  }

  if (!aaContractAddress) {
    return (
      <Text mx={20} variant="title">
        No Omni Account is linked to the current EOA
      </Text>
    );
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
        <Account />
      </Box>
      <DepositWithdraw />
    </Flex>
  );
};

export default AccountPage;
