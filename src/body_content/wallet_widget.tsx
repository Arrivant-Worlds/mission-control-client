import { userResponseDTO } from 'interfaces';
import React, { useEffect } from 'react'

interface WalletWidgetProps {
  connected: boolean;
  user: userResponseDTO;
}

export default function WalletWidget(props: WalletWidgetProps) {
  return (
    <div className="wallet-display"
    style= {{
      width: "8vw",
      position: "relative",
      marginTop: "15px",
      color: "white",
      fontSize: "14px",
      borderColor: 'white',
      height: "50px",
      fontWeight: "700",
      padding: "5px",
      border: "1px solid white",
    }}
    >
      <div style = {{padding: "5px"}} className="text-sm font-medium text-white">
          Wallet:
      </div>
      { props.connected && props.user?.wallet ? (
        <div className="text-sm font-medium text-white">
          {String(props.user.wallet).slice(0, 5)}...{String(props.user.wallet).slice(-5)}
        </div>
      ) : (
      <div  className="wallet-display">
        <div className="text-sm font-medium text-white">
          None
        </div>
      </div>
    )}
    </div>
  )
}