import { useState, useEffect, useCallback, useRef, MutableRefObject } from 'react';

interface EventHandler {
    event: string;
    handler: (event: MessageEvent<any>) => void;
}

// Custom hook to manage SSE connection
export const useSSE = (url: string, handlers: EventHandler[]) => {
  // Store received data (only most recent message)
  const [data, setData] = useState(null);
  
  // Store error state (connection failures, parsing errors, etc.)
  const [error, setError] = useState<string | null>(null);
  
  // Connection status (true: connected, false: disconnected/failed)
  const [isConnected, setIsConnected] = useState(false);
  
  // EventSource object reference - maintains same object across re-renders
  const eventSourceRef = useRef<EventSource | null>(null);
  
  // Reconnection timer reference - for cleanup on component unmount
  const reconnectTimeoutRef = useRef<number | null>(null);

  // SSE connection function
  // useCallback memoizes function - creates new one only when dependencies (url) change
  const connect = useCallback(() => {
    try {
      // Close existing connection if present
      // Prevents duplicate connections before establishing new one
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Create new EventSource object
      // EventSource: built-in browser API for managing SSE connections
      const eventSource = new EventSource(url, {
        withCredentials: true
      });
      eventSourceRef.current = eventSource;

      // Event handler for successful connection
      // onopen: executed when EventSource successfully connects to server
      eventSource.onopen = () => {
        console.log('SSE connection opened');
        setIsConnected(true); // Update connection status
        setError(null); // Clear previous error state
      };

      // Event handler for message reception
      // onmessage: executed whenever server sends "data:" format message
      eventSource.onmessage = (event) => {
        try {
          // event.data: actual data sent by server (string format)
          // JSON.parse: convert string to JavaScript object
          console.log("Received data connected: ", event)
          const parsedData = JSON.parse(event.data);
          setData(parsedData); // Store parsed data in state
        } catch (parseError) {
          // Handle JSON parsing failure
          console.error('Error parsing SSE data:', parseError);
          setError('Data parsing error');
        }
      };

      for (const ev of handlers){
        eventSource.addEventListener(ev.event, ev.handler)
      }

      // Event handler for errors
      // onerror: executed when connection fails, network errors occur, etc.
      eventSource.onerror = (event) => {
        console.error('SSE connection error:', event);
        setIsConnected(false); // Change connection status to false
        
        // Attempt auto-reconnection if connection is completely closed
        // EventSource.CLOSED: permanently closed connection state (value: 2)
        if (eventSource.readyState === EventSource.CLOSED) {
          setError('Connection lost. Attempting to reconnect...');
          
          // Retry connection after 3 seconds (prevents server overload from frequent attempts)
          reconnectTimeoutRef.current = setTimeout(() => {
            connect(); // Recursive call to retry connection
          }, 3000);
        }
      };

    } catch (err) {
      // Handle EventSource object creation failure
      console.error('Error creating SSE connection:', err);
      setError('Connection creation error');
    }
  }, [url]); // Create new connect function when url changes

  // Disconnect function
  const disconnect = useCallback(() => {
    // Close EventSource connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close(); // Close connection
      eventSourceRef.current = null; // Reset reference
    }
    
    // Cancel reconnection timer if running
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    setIsConnected(false); // Update connection status
  }, []);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect(); // Auto-connect when component mounts
    
    // cleanup function: executed on component unmount
    // Prevents memory leaks by cleaning up connections
    return () => {
      disconnect();
    };
  }, [connect, disconnect]); // Re-execute if dependencies change

  // Return values and functions for external use
  return {
    data,        // Latest received data
    error,       // Error message
    isConnected, // Connection status
    connect,     // Manual connection function
    disconnect   // Manual disconnect function
  };
};
