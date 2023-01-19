import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import 'simplebar-react/dist/simplebar.min.css';
import { useNavigate } from "react-router-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import MAIN_PAGE from "./body_content/main_page.js";
import MOBILE_BANNER from "./body_content/mobile_banner.js";
import React, { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { SolanaWallet } from "@web3auth/solana-provider";
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
    FractalWalletAdapter
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AnalyticsProvider } from "./mixpanel.js"
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { SolanaWalletConnectorPlugin } from "@web3auth/solana-wallet-connector-plugin";
import RPC from "./solanaRPC.js"

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
          chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
          rpcTarget: "https://few-wider-smoke.solana-devnet.quiknode.pro/9693e676796c6186c530ae5eeead60af2a7852e6/", // This is the public RPC we have added, please pass on your own endpoint while creating an app
        },
      });


      setWeb3auth(web3auth);

      await web3auth.initModal();

      if (web3auth.provider) {
          const solanaWallet = new SolanaWallet(web3auth.provider);
          const accounts = await solanaWallet.requestAccounts()
          setPublicKey(accounts[0])
          setWallet(solanaWallet)
          setProvider(web3auth.provider);

      };

      const torusPlugin = new SolanaWalletConnectorPlugin({
        torusWalletOpts: {},
        walletInitOptions: {
          whiteLabel: {
            name: "Whitelabel Demo",
            theme: { isDark: true, colors: { torusBrand1: "#00a8ff" } },
            logoDark: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
            logoLight: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
            topupHide: true,
            defaultLanguage: "en",
          },
          useWalletConnect: true,
          enableLogging: true,
        },
      });
      await web3auth.addPlugin(torusPlugin);

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
        sendTransaction,
        signTransaction,
      }}
    >
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
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
