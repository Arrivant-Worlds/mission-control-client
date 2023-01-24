import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import 'simplebar-react/dist/simplebar.min.css';
import MAIN_PAGE from "./body_content/main_page.js";
import MOBILE_BANNER from "./body_content/mobile_banner.js";
import React, { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SolanaWallet } from "@web3auth/solana-provider";
import { SolflareAdapter } from "@web3auth/solflare-adapter";
import { PhantomAdapter } from "@web3auth/phantom-adapter";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { clusterApiUrl } from '@solana/web3.js';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AnalyticsProvider } from "./mixpanel.js"
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { SolanaWalletConnectorPlugin } from "@web3auth/solana-wallet-connector-plugin";
import RPC from "./solanaRPC.js"
import { RPC_CONNECTION_URL } from './api_calls/constants';

require('@solana/wallet-adapter-react-ui/styles.css');

const theme = createTheme({
  typography: {
    fontFamily: "Proxima Nova, sans-serif",
    fontWeight: "400",
    allVariants: {
      color: "#F6F6F6"
    }
  },
  palette: {
    primary: {
      main: '#F6F6F6',
    },
  },
  overrides: {
  }
});
const clientId = "BKm_sswQ9xirQNu6wNjUvprZ0_n1EISbnx_IrFqKP55scoZvuuEUfIgsNzJM3Psnzrc5o83bAZ-Nyzo4BzMVROY"
const WalletContext = createContext(null);

const App = ()=> {
  return (
    <Context>
      <Content/>
    </Context>
  );
}

export default App;

const Context = ({ children }) => {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [publicKey, setPublicKey] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = useCallback(async () => {
    try {
      const web3auth = new Web3Auth({
        clientId, 
        web3AuthNetwork: "testnet", // mainnet, aqua, celeste, cyan or testnet
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
          rpcTarget: RPC_CONNECTION_URL, // This is the public RPC we have added, please pass on your own endpoint while creating an app
        },
      });

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          uxMode: "popup",
          whiteLabel: {
            name: "Mission Control",
            logoLight: "https://aurahma-bucket.s3.eu-north-1.amazonaws.com/favicon.ico",
            logoDark: "https://aurahma-bucket.s3.eu-north-1.amazonaws.com/favicon.ico",
            defaultLanguage: "en",
            dark: true, // whether to enable dark mode. defaultValue: false
          },
        }
      });

      console.log("openloginAdapter", openloginAdapter)

      web3auth.configureAdapter(openloginAdapter);

      const solflareAdapter = new SolflareAdapter({
        clientId,
      });
      web3auth.configureAdapter(solflareAdapter);

      const phantomAdapter = new PhantomAdapter({
        clientId,
      });
      web3auth.configureAdapter(phantomAdapter);

      const torusPlugin = new SolanaWalletConnectorPlugin({
        torusWalletOpts: {},
        walletInitOptions: {
          whiteLabel: {
            name: "Mission Control",
            theme: { isDark: true, colors: { torusBrand1: "#00a8ff" } },
            logoDark: "https://aurahma-bucket.s3.eu-north-1.amazonaws.com/favicon.ico",
            logoLight: "https://aurahma-bucket.s3.eu-north-1.amazonaws.com/favicon.ico",
            topupHide: true,
            defaultLanguage: "en",
          },
          useWalletConnect: true,
          enableLogging: true,
          apiKey: clientId,
        },
      });
      let isInit = await web3auth.addPlugin(torusPlugin);

      setWeb3auth(web3auth);
      await web3auth.initModal();

      if (web3auth.provider) {
        const solanaWallet = new SolanaWallet(web3auth.provider);
        const accounts = await solanaWallet.requestAccounts()
        setPublicKey(accounts[0])
        setWallet(solanaWallet)
        setProvider(web3auth.provider);

    };
      console.log("Torus Plugin", torusPlugin)
      let initiatedTopUp = await torusPlugin.initiateTopup('moonpay')
      console.log("initiated ToppUp", initiatedTopUp)

    } catch (error) {
      console.error(error);
    }
  }, []);


  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    init()

  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const idToken = await web3auth.authenticateUser();
    console.log(idToken);
    return idToken.idToken
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    console.log("GOT BALANCE", balance);
    return balance
  }

  const sendTransaction = async (transaction) => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const receipt = await rpc.sendTransaction(transaction);
    console.log(receipt);
  };

  const signTransaction = async (transaction) => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signature = await rpc.signTransaction(transaction);
    return signature
  }

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log("USER INFO", user);
    return user
  };

  const getPrivateKey = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    console.log("THIS IS PRIVATE", privateKey);
    return privateKey
  };



  const connected = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return false;
    }
    const user = await web3auth.getUserInfo();
    if(user) return true
    else return false
  }

  const signMessage = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const signedMessage = await rpc.signMessage();
    return signedMessage
  };

  return (
    <WalletContext.Provider
      value={{
        provider,
        wallet,
        login,
        logout,
        authenticateUser,
        signMessage,
        getUserInfo,
        connected,
        publicKey,
        getPrivateKey,
        getBalance,
        sendTransaction,
        signTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export function useWeb3Wallet() {
  const context = useContext(WalletContext);
  if (context === null) {
    throw new Error('useWallet must be used within an WalletProvider');
  }
  return context;
}


const Content = () => {
  const media_query_1000 = useMediaQuery('(min-width:1000px)');

  return (
  <AnalyticsProvider>
    <ThemeProvider theme={theme}>
      <Box className="App">
        {media_query_1000 ?  <MAIN_PAGE/> : <MOBILE_BANNER/>}
      </Box>
    </ThemeProvider>
  </AnalyticsProvider>

  );
};
