import mixpanel from "mixpanel-browser"
import React, { useContext, useEffect, useState, createContext } from "react"
import { useLocation } from "react-router";
import { useWeb3Wallet } from "./App";
import { useWallet } from "@solana/wallet-adapter-react";
import { ethos } from "ethos-connect";

let MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN;
const debugAnalytics = true;
type AnalyticsAction = string; // TODO: will remove string in future

interface GenericTrackingAttributes {
  [key: string]: string | number | boolean | any[] | null | undefined;
}


export interface TrackingAttributes extends GenericTrackingAttributes {
  event_category:
    | "Global"
    | "Missions"
    | "Button Click"
    | "Journey"
    | "Wallet"
    | "Navigate"
  event_label: string;
  value?: number;
}

export enum MixpanelUserPropertyNames {
  FirstMissionClaim = "First Mission Claim",
  LastMissionClaim = "Last Mission Claim",
  MissionsDone = "Missions done",
  CustomAttribute = "Custom Attribute", // new enum member with string value
  JourneyRewardsClaimed = "Journey rewards claimed",
}

export type TrackingFunctionSignature = (
  action: AnalyticsAction,
  attributes: TrackingAttributes
) => void;

type TrackingPropertySignature = (
  propertyName: MixpanelUserPropertyNames | any,
  propertyValue: any
) => void;

type TrackingIncrementSignature = (
  propertyName: MixpanelUserPropertyNames,
  by: number
) => void;

interface IAnalyticsContext {
  track: TrackingFunctionSignature;
  setProperty: TrackingPropertySignature;
  setPropertyIfNotExists: TrackingPropertySignature;
  increment: TrackingIncrementSignature;
}

function getQueryParam(url: any, param: any) {
  // Expects a raw URL
  // eslint-disable-next-line no-empty-character-class, no-useless-escape
  param = param.replace(/[[]/, "[").replace(/[]]/, "]");
  // eslint-disable-next-line no-useless-escape
  var regexS = "[?&]" + param + "=([^&#]*)",
    regex = new RegExp(regexS),
    results = regex.exec(url);
  //@ts-ignore
  if (
    results === null ||
    //@ts-ignore
    (results && typeof results[1] !== "string" && results[1].length)
  ) {
    return "";
  } else {
    return decodeURIComponent(results[1]).replace(/\W/gi, " ");
  }
}
function campaignParams() {
  try {
    var campaign_keywords =
      "utm_source utm_medium utm_campaign utm_content utm_term".split(" "),
      kw = "",
      params = {},
      first_params = {};
    var index;
    for (index = 0; index < campaign_keywords.length; ++index) {
      kw = getQueryParam(document.URL, campaign_keywords[index]);
      if (kw.length) {
        //@ts-ignore
        params[campaign_keywords[index] + " [last touch]"] = kw;
      }
    }
    for (index = 0; index < campaign_keywords.length; ++index) {
      kw = getQueryParam(document.URL, campaign_keywords[index]);
      if (kw.length) {
        //@ts-ignore
        first_params[campaign_keywords[index] + " [first touch]"] = kw;
      }
    }
    mixpanel.people.set(params);
    mixpanel.people.set_once(first_params);
    mixpanel.register(params);
  } catch (e) {

  }
}

const AnalyticsContext = createContext<IAnalyticsContext | null>(null);


export function AnalyticsProvider(props: { children: React.ReactNode }) {
  const SolanaWallet = useWallet();
  const { publicKey } = useWeb3Wallet();
  const SuiWallet = ethos.useWallet()
  let pubkey = SolanaWallet.publicKey?.toBase58() || SuiWallet.wallet?.address || publicKey
  const router = useLocation();
  const [trackingInitialized, setTrackingInitialized] = useState(false);
  const [lastPubkeyConnected, setLastPubkeyConnected] = useState<string | null>(null);
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
    if (MIXPANEL_TOKEN && pubkey) {
      mixpanel.identify(pubkey)
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

  function pageview(opts?: { initialPageview?: boolean }) {
    track('Page View', {
      event_category: 'Navigate',
      event_label: router.pathname,
      initialPageview: opts?.initialPageview,
    });
  }

  let setPropertyIfNotExists: TrackingPropertySignature =
  function setPropertyIfNotExists(propertyName, propertyValue) {
    let property: any = {};
    property[propertyName] = propertyValue;
    try {
      mixpanel.people.set_once(property);
    } catch (err) {
      console.log("mixpanel", err);
    }
  };

  let setProperty: TrackingPropertySignature = function setProperty(
    propertyName: string,
    propertyValue: any
  ) {
    let property: any = {};
    property[propertyName] = propertyValue;
    try {
      mixpanel.people.set(property);
    } catch (err) {
      console.log("mixpanel", err);
    }
  };

  let increment: TrackingIncrementSignature = function increment(
    propertyName: string,
    incrementBy: number
  ) {
    try {
      mixpanel.people.increment(`${propertyName}`, incrementBy);
    } catch (err) {
      console.log("mixpanel", err);
    }
  };
  // initialize (goes first no matter what)
  useEffect(() => {
    if (!trackingInitialized && MIXPANEL_TOKEN) {
      initializeTracking();
      campaignParams();
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
          pubkey
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
