export interface AccountDetails {
    balance: string; 
    nonce: number;
    history: Transaction[];
  }
  
export interface Transaction {
    hash: string;
    to: string;
    from: string;
    value: string;
    timestamp: string;
  }
  