import { useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
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
    <Box>
      <Account address={aaContractAddress} />
      <DepositWithdraw
        aaContractAddress={aaContractAddress}
        abstractAccountABI={AbstractAccountABI}
      />
    </Box>
  );
};

export default AccountPage;
