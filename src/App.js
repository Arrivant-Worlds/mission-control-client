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
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { SolanaWalletConnectorPlugin } from "@web3auth/solana-wallet-connector-plugin";
import RPC from "./solanaRPC.js"
import { RPC_CONNECTION_URL } from './api_calls/constants';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { FractalWalletAdapter, LedgerWalletAdapter, PhantomWalletAdapter, SlopeWalletAdapter, SolflareWalletAdapter, SolletExtensionWalletAdapter, SolletWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

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
const clientId = "BJ5pQR_65We--rYeJK4OBJm8Czpc36xJLhPAvIwaOm-hSSaVcCMW3rqIYvNa5bb2R7mCQsxBS9Ju_RdtKYo_Pfo"
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
        web3AuthNetwork: "cyan", // mainnet, aqua, celeste, cyan or testnet
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x1", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
          rpcTarget: RPC_CONNECTION_URL, // This is the public RPC we have added, please pass on your own endpoint while creating an app
        },
        uiConfig: {
          theme: "dark",
          appLogo: "https://aurahma-bucket.s3.eu-north-1.amazonaws.com/favicon.ico",
          appName: "Mission Control",
          loginMethodsOrder: ["google", "twitter", "discord"]
        }
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
          }
        },
        loginSettings: {
          loginProvider: ['discord'],
        }
      });


      console.log("openloginAdapter", openloginAdapter)

      web3auth.configureAdapter(openloginAdapter);


      const phantomAdapter = new PhantomAdapter({
        sessionTime: 86400,
        clientId,
      });
      web3auth.configureAdapter(phantomAdapter);

      const solflareAdapter = new SolflareAdapter({
        sessionTime: 86400,
        clientId,
      });
      web3auth.configureAdapter(solflareAdapter);


      setWeb3auth(web3auth);
      await web3auth.initModal({
        modalConfig: {
          [WALLET_ADAPTERS.OPENLOGIN]: {
            label: "openlogin",
            loginMethods: {
              google: {
                name: "google login",
                logoDark: "url to your custom logo which will shown in dark mode",
              },
              facebook: {
                // it will hide the facebook option from the Web3Auth modal.
                name: "facebook login",
                showOnModal: false,
              },
              reddit: {
                // it will hide the facebook option from the Web3Auth modal.
                name: "reddit login",
                showOnModal: false,
              },
              apple: {
                // it will hide the facebook option from the Web3Auth modal.
                name: "twitter login",
                showOnModal: false,
              },
              line: {
                // it will hide the facebook option from the Web3Auth modal.
                name: "twitter login",
                showOnModal: false,
              },
              github: {
                // it will hide the facebook option from the Web3Auth modal.
                name: "twitter login",
                showOnModal: false,
              },
              kakao: {
                // it will hide the facebook option from the Web3Auth modal.
                name: "twitter login",
                showOnModal: false,
              },
              weibo: {
                // it will hide the facebook option from the Web3Auth modal.
                name: "twitter login",
                showOnModal: false,
              },
              email_passwordless: {
                // it will hide the facebook option from the Web3Auth modal.
                name: "twitter login",
                showOnModal: false,
              },

            },
            // setting it to false will hide all social login methods from modal.
            showOnModal: true,
          },
        },
      });

      if (web3auth.provider) {
        const solanaWallet = new SolanaWallet(web3auth.provider);
        const accounts = await solanaWallet.requestAccounts()
        setPublicKey(accounts[0])
        setWallet(solanaWallet)
        setProvider(web3auth.provider);

    };
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
    console.log("LOGGIN OUT")
    await web3auth.logout();
    setProvider(null);
  };

  const authenticateUser = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    console.log("trying to auth")
    let idToken;
    try{
      idToken = await web3auth.authenticateUser();
    } catch(err){
      console.log(err)
    }
    console.log("sucessfully authed")
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
    return receipt
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
    <SolanaWalletContext>
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
    </SolanaWalletContext>
  );
};

export function useWeb3Wallet() {
  const context = useContext(WalletContext);
  if (context === null) {
    throw new Error('useWallet must be used within an WalletProvider');
  }
  return context;
}


export const SolanaWalletContext: FC<{ children: ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
      new FractalWalletAdapter({ network })
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

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
