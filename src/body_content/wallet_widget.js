import React, { useEffect } from 'react'

export default function WalletWidget({connected, publicKey}) {
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
      { connected ? (
        <div className="text-sm font-medium text-white">
          {String(publicKey).slice(0, 5)}...{String(publicKey).slice(-5)}
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