import { Flex, Button, Box, Image } from "@chakra-ui/react";
import { useEthereum } from "../contexts/EthereumContext";
import { useLocation, useNavigate } from "react-router-dom";

const Banner = () => {
  const { account, connect } = useEthereum();
  const navigate = useNavigate();
  const location = useLocation();

  const baseStyle = {
    bg: "transparent",
    border: "none",
    color: "#666666",
    fontSize: "14px",
    _hover: { bg: "transparent", textDecoration: "none" },
    _active: { bg: "transparent" },
    _focus: { boxShadow: "none" },
  };

  const activeStyle = {
    color: "brand.500",
    textDecoration: "none",
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      as="nav"
      bg="rgba(255, 255, 255, 0.5)"
      p={4}
      color="black"
      borderBottom="2px solid"
    >
      <Flex
        align="center"
        justify="space-between"
        wrap="wrap"
        maxW="1280px"
        width="1280px"
        m="0 auto"
      >
        <Flex align="center" gap="64px">
          <Image
            src="/logo512.png"
            alt="Logo"
            width="200px"
            height="40px"
            borderRadius="0px"
          />
          <Button
            onClick={() => navigate("/userop-execution")}
            sx={{
              ...baseStyle,
              ...(isActive("/userop-execution") ? activeStyle : {}),
            }}
          >
            UserOp Execution
          </Button>
          <Button
            onClick={() => navigate("/ticket-interaction")}
            sx={{
              ...baseStyle,
              ...(isActive("/ticket-interaction") ? activeStyle : {}),
            }}
          >
            Ticket Interaction
          </Button>
          <Button
            onClick={() => navigate("/account-page")}
            sx={{
              ...baseStyle,
              ...(isActive("/account-page") ? activeStyle : {}),
            }}
          >
            AA Contract Interaction
          </Button>
          <Button
            onClick={() => navigate("/create-aa-account")}
            sx={{
              ...baseStyle,
              ...(isActive("/create-aa-account") ? activeStyle : {}),
            }}
          >
            Create AA Account
          </Button>
        </Flex>

        <Flex align="center">
          {account ? (
            <Button variant="solid">
              {account.slice(0, 6) + "..." + account.slice(-4)}
            </Button>
          ) : (
            <Button onClick={connect} variant="solid">
              Connect Wallet
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Banner;
