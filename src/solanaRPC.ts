import {
    Connection,
    PublicKey,
    Transaction,
  } from "@solana/web3.js";
import { SolanaWallet } from "@web3auth/solana-provider";
import { SafeEventEmitterProvider } from "@web3auth/base";
  
  export default class SolanaRpc {
    provider;
  
    constructor(provider: SafeEventEmitterProvider) {
      this.provider = provider;
    }
  
    getAccounts = async (): Promise<string[]> => {
      try {
        const solanaWallet = new SolanaWallet(this.provider);
        const acc = await solanaWallet.requestAccounts()
  
        return acc;
      } catch (error) {
        //@ts-ignore
        return error
      }
    };
  
    getBalance = async (): Promise<number> => {
      try {
        const solanaWallet = new SolanaWallet(this.provider);
        const connectionConfig: any = await solanaWallet.request({
          method: "solana_provider_config",
          params: [],
        });
        console.log("rpc target", connectionConfig.rpcTarget)
        const conn = new Connection(connectionConfig.rpcTarget);
  
        const accounts = await solanaWallet.requestAccounts();
        const balance = await conn.getBalance(new PublicKey(accounts[0]));
        return balance;
      } catch (error) {
        //@ts-ignore

        return error
      }
    };
  
    signMessage = async (solanaWallet: SolanaWallet): Promise<string> => {
      try {
        const msg = Buffer.from("Test Signing Message ", "utf8");
        const res = await solanaWallet.signMessage(msg);
  
        return res.toString();
      } catch (error) {
        //@ts-ignore
        return error
      }
    };
  
    sendTransaction = async (transaction: Transaction, solanaWallet: SolanaWallet) => {
      try {
        const { signature } = await solanaWallet.signAndSendTransaction(
          transaction
        );
  
        return signature;
      } catch (error) {
        return error 
      }
    };
  
    signTransaction = async (solanaWallet: SolanaWallet, transaction: Transaction) => {
        console.log("PASSING", transaction)
        const signedTx = await solanaWallet.signTransaction(transaction);
        return signedTx
    };
  
    getPrivateKey = async (): Promise<unknown> => {
      const privateKey = await this.provider.request({
        method: "solanaPrivateKey",
      });
  
      return privateKey
    };
  }