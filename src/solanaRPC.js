import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
  } from "@solana/web3.js";
import { SolanaWallet } from "@web3auth/solana-provider";
  
  export default class SolanaRpc {
    provider;
  
    constructor(provider) {
      this.provider = provider;
    }
  
    getAccounts = async () => {
      try {
        const solanaWallet = new SolanaWallet(this.provider);
        const acc = await solanaWallet.requestAccounts()
  
        return acc;
      } catch (error) {
        return error
      }
    };
  
    getBalance = async () => {
      try {
        const solanaWallet = new SolanaWallet(this.provider);
        const connectionConfig = await solanaWallet.request({
          method: "solana_provider_config",
          params: [],
        });
        const conn = new Connection(connectionConfig.rpcTarget);
  
        const accounts = await solanaWallet.requestAccounts();
        const balance = await conn.getBalance(new PublicKey(accounts[0]));
  
        return balance.toString();
      } catch (error) {
        return error
      }
    };
  
    signMessage = async () => {
      try {
        const solanaWallet = new SolanaWallet(this.provider);
        const msg = Buffer.from("Test Signing Message ", "utf8");
        const res = await solanaWallet.signMessage(msg);
  
        return res.toString();
      } catch (error) {
        return error
      }
    };
  
    sendTransaction = async (transaction) => {
      try {
        const solanaWallet = new SolanaWallet(this.provider);
        const { signature } = await solanaWallet.signAndSendTransaction(
          transaction
        );
  
        return signature;
      } catch (error) {
        return error 
      }
    };
  
    signTransaction = async (transaction) => {
        console.log("PASSING", transaction)
      try {
        console.log("ROOT TRANSACTION")
        const solanaWallet = new SolanaWallet(this.provider);
        const signedTx = await solanaWallet.signTransaction(transaction);
        return signedTx
      } catch (error) {
        return error
      }
    };
  
    getPrivateKey = async () => {
      const privateKey = await this.provider.request({
        method: "solanaPrivateKey",
      });
  
      return privateKey
    };
  }