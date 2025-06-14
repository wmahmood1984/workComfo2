import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";

export default function ConnectButton() {
    const { open, close,} = useAppKit()
    const {disconnect} = useDisconnect()

    const { address, isConnected, caipAddress, status } = useAppKitAccount()
    console.log("first",isConnected)
    
    return (
        <>
           <button

           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                onClick={async () => {
                    if (isConnected) {
                        await disconnect()
                    } else {
                        await open()
                    }
                }}
                
             
            >
               {isConnected ? `${address.slice(0,4)}...${address.slice(-5)}` : "Not connected"}
   
            </button>
            
        </>
    )
}
