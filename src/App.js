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
import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  BloctoWalletAdapter,
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
import useMediaQuery from '@mui/material/useMediaQuery';
import { AnalyticsProvider } from "./mixpanel.js"
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
  const network = WalletAdapterNetwork.Mainnet;

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
      new BloctoWalletAdapter({ network }),
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
