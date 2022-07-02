import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import background from './images/MissionControl_HQ_background.jpg';
import black_circle from './images/black_circle.png';
import 'simplebar-react/dist/simplebar.min.css';
import { useNavigate } from "react-router-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import MAIN_PAGE from "./body_content/main_page.js";
import CONNECT_PAGE from "./body_content/connect_page.js";
import CONNECT_WALLET from "./body_content/connect_wallet.js";
import BOUNTY_PAGE from "./body_content/bounty_page.js";
import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
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
    // MuiTypography: {
    //   root: {
    //   },
    //   body1: {
    //     // '&:hover': {
    //       //    color: '#15B999'
    //       // }
    //   },
    // }
  }
});

const App: FC = ()=> {
  return (
    <Context>
      <Content />
    </Context>
  );
}

export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
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
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content: FC = (connection) => {
  let navigate = useNavigate();
  const handleOnClick = () => {
    navigate('/');
  }
  return (
    <ThemeProvider theme={theme}>
      <Box className="App" style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        height: '100vh',
        width: '100vw',
      }}>
        <Box component="img" sx={{position: 'absolute', top: '40px', left: "40px", cursor: "pointer"}} src={black_circle} alt="black_circle_logo" onClick={() => handleOnClick()}/>
        <MAIN_PAGE/>
      </Box>
    </ThemeProvider>
  );
};
