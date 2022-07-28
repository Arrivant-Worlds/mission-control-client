import { useAnchorWallet } from "@solana/wallet-adapter-react";
import mixpanel from "mixpanel-browser"
import React, { useContext, useEffect, useState, createContext } from "react"
import { useLocation } from "react-router";

let MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN;
const debugAnalytics = true;
type AnalyticsAction = string; // TODO: will remove string in future

interface GenericTrackingAttributes {
  [key: string]: string | number | boolean | any[] | null | undefined;
}
export interface TrackingAttributes extends GenericTrackingAttributes {
  event_category:
  | 'Global'
  | 'Buy'
  | 'Canvas'
  | 'Mint'
  | 'Quest'
  | 'Marketplace'
  | 'Connection'
  | 'Navigate',
  event_label: string;
  value?: number;
}

export type TrackingFunctionSignature = (
  action: AnalyticsAction,
  attributes: TrackingAttributes
) => void;


const AnalyticsContext = createContext(null);


export function AnalyticsProvider(props: { children: React.ReactNode }) {
  const router = useLocation();
  const [trackingInitialized, setTrackingInitialized] = useState(false);
  const [lastPubkeyConnected, setLastPubkeyConnected] = useState(undefined);

  const wallet = useAnchorWallet();
  const pubkey = wallet?.publicKey.toBase58();

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
    if (MIXPANEL_TOKEN) {
      mixpanel.identify(pubkey);
      mixpanel.people.set_once({
        pubkey,
      });
      mixpanel.people.set({
        "Relogin Date": new Date().toString(),
      });
    }
    if (debugAnalytics) {
      console.log('identify', pubkey, integrations);
    }
  }

  function resetTracking() {
    mixpanel.reset();
  }

  function pageview(opts?: { initialPageview?: boolean }) {
    track('Page View', {
      event_category: 'Navigate',
      event_label: router.pathname,
      initialPageview: opts?.initialPageview,
    });
  }

  function setPropertyIfNotExists(propertyName, propertyValue) {
      let property = {}
      property[propertyName] = propertyValue
      mixpanel.people.set_once(property)
  }

  function setProperty(propertyName, propertyValue) {
    let property = {}
    property[propertyName] = propertyValue
    mixpanel.people.set(property)
}

  function increment(propertyName, incrementBy){
    mixpanel.people.increment(`${propertyName}`, incrementBy);
  }

  // initialize (goes first no matter what)
  useEffect(() => {
    if (!trackingInitialized && MIXPANEL_TOKEN) {
      initializeTracking();
    } 
    /*eslint-disable*/

  }, [trackingInitialized]);

  useEffect(() => {
    if (trackingInitialized) {
      if (pubkey) {
        identify();
        track('Wallet Connection Made', {
          event_category: 'Wallet',
          event_label: pubkey,
          pubkey,
        });
      } else if (!pubkey && lastPubkeyConnected) {
        track('Wallet Connection Broken', {
          event_category: 'Wallet',
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

  function track(action: AnalyticsAction, attributes: TrackingAttributes) {
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
        // console.log('track', action, attributes, integrations);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AnalyticsContext.Provider
      value={{
        track,
        setPropertyIfNotExists,
        increment,
        setProperty
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
