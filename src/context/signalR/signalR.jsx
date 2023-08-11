import React, { useContext, useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  HttpTransportType,
  LogLevel,
} from "@microsoft/signalr";

//context
import { UserAuthState } from "../../context/user/userContext";

import { AppConfig } from "../../services/config";

import { getAllThreadid } from "../../services/messageCenterServices";

const SignalRDispatchContext = React.createContext();

export const useSignalRDispatch = () => {
  const context = useContext(SignalRDispatchContext);
  return context;
};

export const SignalRContext = ({ children }) => {
  const userState = UserAuthState();

  const [hubConnection, setHubConnection] = useState(null);

  useEffect(() => {
    if (hubConnection) {
      hubConnection.onclose(async () => {
        hubConnection.start();
      });
    }
  }, [hubConnection]);

  const startHubConnectionHandler = (id) => {
    const Connection = new HubConnectionBuilder()
      .withUrl(`${AppConfig.chatHubUrl}/chathub`, {
        //skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setHubConnection(Connection);

    Connection.start().then(() => {
      getThreadIdAll(id, Connection);
      addUserToCache(id, Connection);
    });
  };



  const revokeHubConnectionHandler = () => {
    hubConnection.onclose(async () => {
      hubConnection.start();
    });
  };

  const removeHubConnectionHandler = () => {
    hubConnection.onclose(async () => {
      hubConnection.close();
    });
  };

  const addUserToCache = (id, connection) => {

    if (connection?._connectionStarted) {
      connection.invoke("AddUserMappingToCache", id);
    }
  };

  const getThreadIdAll = (id, connection) => {
    getAllThreadid(id)
      .then(async (res) => {
      
        let data = await res.data.$values;
        data.forEach((element) => {
          if (connection._connectionStarted) {
            connection.invoke("JoinGroup", element);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <SignalRDispatchContext.Provider
      value={{
        hubConnection,
        startHubConnectionHandler,
        revokeHubConnectionHandler,
        getThreadIdAll,
        addUserToCache,
      }}
    >
      {children}
    </SignalRDispatchContext.Provider>
  );
};
