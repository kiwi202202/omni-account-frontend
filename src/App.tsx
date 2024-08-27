import React, { useEffect } from "react";
import { ChakraProvider, useToast } from "@chakra-ui/react";
import { EthereumProvider, useEthereum } from "./contexts/EthereumContext";
import AppRoutes from "./routes/AppRoutes";
import theme from "./theme/theme";

interface EthereumContextType {
  error?: string;
}

const AppWithToast: React.FC = () => {
  const { error } = useEthereum() as EthereumContextType;
  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  return <AppRoutes />;
};

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <EthereumProvider>
        <AppWithToast />
      </EthereumProvider>
    </ChakraProvider>
  );
};

export default App;
