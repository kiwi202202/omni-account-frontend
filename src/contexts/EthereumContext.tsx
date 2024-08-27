import { createContext, useContext, useState, ReactNode } from "react";
import { ethers } from "ethers";

interface EthereumContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: string | null;
  connect: () => Promise<void>;
  switchNetwork: (chainId: string) => Promise<void>;
  error: string;
}

const EthereumContext = createContext<EthereumContextType | undefined>(
  undefined
);

export const useEthereum = (): EthereumContextType => {
  const context = useContext(EthereumContext);
  if (context === undefined) {
    throw new Error("useEthereum must be used within an EthereumProvider");
  }
  return context;
};

interface EthereumProviderProps {
  children: ReactNode;
}

const checkNetwork = async (
  provider: ethers.BrowserProvider
): Promise<boolean> => {
  const expectedChainIds = process.env.REACT_APP_CHAINIDS?.split(",") || [];

  try {
    const network = await provider.getNetwork();
    const currentChainId = network.chainId.toString();

    if (!expectedChainIds.includes(currentChainId)) {
      console.log(
        `Connected to chainId ${currentChainId}, but expected one of ${expectedChainIds.join(
          ", "
        )}`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking network chainId:", error);
    return false;
  }
};

export const EthereumProvider = ({ children }: EthereumProviderProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [error, setError] = useState<string>("");
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  const connect = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      const networkOk = await checkNetwork(provider);
      if (!networkOk) {
        setError(
          "You're connected to an unsupported network. Please switch to Sepolia, Polygon zkevm or Arbitrum."
        );
        return;
      }

      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();

      setAccount(account);
      setSigner(signer);
      setChainId(network.chainId.toString());
      setError("");
    } catch (error) {
      console.error("Failed to connect MetaMask", error);
      setError("Failed to connect MetaMask.");
    }
  };

  const switchNetwork = async (newChainId: string) => {
    if (!provider) {
      setError("No provider found. Please connect to MetaMask first.");
      return;
    }

    try {
      const network = await provider.getNetwork();
      if (network.chainId.toString() === newChainId) {
        setError("");
        return;
      }

      const hexChainId = ethers
        .toBeHex(parseInt(newChainId))
        .replace(/^0x0+/, "0x");
      await provider.send("wallet_switchEthereumChain", [
        { chainId: hexChainId },
      ]);

      // Refresh
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const updatedSigner = await newProvider.getSigner();
      const updatedNetwork = await newProvider.getNetwork();

      setProvider(newProvider);
      setSigner(updatedSigner);
      setChainId(updatedNetwork.chainId.toString());
      setError("");
    } catch (error) {
      console.error("Failed to switch network", error);
      console.error("Error object:", error);
      const errorCode = (error as any)?.error?.code;
      if (errorCode === 4902) {
        setError(
          "This network is not available in your MetaMask, please add it."
        );
      } else {
        setError(`Failed to switch network. Error: ${(error as any).message}`);
      }
    }
  };

  return (
    <EthereumContext.Provider
      value={{
        account,
        provider,
        signer,
        chainId,
        connect,
        switchNetwork,
        error,
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
};
