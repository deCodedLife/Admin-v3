import { useEffect, useState } from "react"


const useWebSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    useEffect(() => {
        const instance = new WebSocket("ws://websockets.mewbas.com:4278")
        instance.onopen = () => setSocket(instance)
        
        return () => instance.close()
    }, [])
    return socket
}

export default useWebSocket