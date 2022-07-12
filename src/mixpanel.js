import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import mixpanel from "mixpanel-browser"
import React, { useContext, useEffect, useState, createContext } from "react"
import { useLocation } from "react-router";

let MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN;
const debugAnalytics = true;

const AnalyticsContext = createContext(null);


export function AnalyticsProvider(props) {
  const router = useLocation();
  const [trackingInitialized, setTrackingInitialized] = useState(false);
  const [lastPubkeyConnected, setLastPubkeyConnected] = useState(undefined);

  const {publicKey} = useWallet();
  const pubkey = publicKey?.toBase58();


  function initializeTracking() {
    const integrations = {
      mixpanel: !!MIXPANEL_TOKEN,
    };

    if (MIXPANEL_TOKEN) {
      mixpanel.init(MIXPANEL_TOKEN, {
        debug: !window.location.host.includes('.com'),
      });
    }

    if (debugAnalytics) {
      console.log('tracking initialized', integrations);
    }

    pageview({ initialPageview: true });
    setTrackingInitialized(true);
  }

  function identify() {
    const integrations = {
      mixpanel: !!MIXPANEL_TOKEN,
    };
    if (integrations.mixpanel) {
      mixpanel.identify(pubkey);
      mixpanel.people.set_once({
        pubkey,
      });
    }
    if (debugAnalytics) {
      console.log('identify', pubkey, integrations);
    }
  }

  function resetTracking() {
    mixpanel.reset();
  }

  function pageview(opts) {
    track('Page View', {
      event_category: 'Navigate',
      event_label: router.pathname,
      initialPageview: opts?.initialPageview,
    });
  }

  // initialize (goes first no matter what)
  useEffect(() => {
    if (!trackingInitialized && MIXPANEL_TOKEN) {
      initializeTracking();
    } else if (trackingInitialized) {
      resetTracking();
    }
    /*eslint-disable*/ 

  }, [trackingInitialized]);

  useEffect(() => {
    if (trackingInitialized) {
      if (pubkey) {
        identify();
        track('Wallet Connection Made', {
          event_category: 'Global',
          event_label: pubkey,
          pubkey,
        });
      } else if (!pubkey && lastPubkeyConnected) {
        track('Wallet Connection Broken', {
          event_category: 'Global',
          event_label: lastPubkeyConnected,
          pubkey: lastPubkeyConnected,
        });
      }
      setLastPubkeyConnected(pubkey);
    }

  }, [pubkey, trackingInitialized]);
  useEffect(() => {
    pageview({ initialPageview: false });
  }, [router]);
/*eslint-enable*/

  function track(action, attributes) {
    const integrations = {
      mixpanel: !!MIXPANEL_TOKEN,
    };

    try {

      if (integrations.mixpanel) {
        mixpanel.track(action, {
          ...attributes,
        });
      }

      if (debugAnalytics) {
        console.log('track', action, attributes, integrations);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AnalyticsContext.Provider
      value={{
        track,
      }}
    >
      {props.children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === null) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
