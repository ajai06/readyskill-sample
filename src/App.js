import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import FadeLoader from "react-spinners/FadeLoader";

import AppRoutes from "./core/appRoutes";
import { createAxiosResponseInterceptor } from "./services/apiServices";

import { UserContext } from "./context/user/userContext";
import { ToastContext } from "./context/toast/toastContext";
import { withProviders } from "./context/withProvider";
import { SignalRContext } from "./context/signalR/signalR";

import "./App.scss";
import BaseUrlManagement from "./sharedComponents/baseUrlConfiguration/baseUrlManagement";

function App() {
  useEffect(() => {
    createAxiosResponseInterceptor();
  }, []);

  const useAxiosLoader = () => {
    const [counter, setCounter] = useState(0);
    const inc = useCallback(
      () => setCounter((counter) => counter + 1),
      [setCounter]
    ); // add to counter
    const dec = useCallback(
      () => setCounter((counter) => counter - 1),
      [setCounter]
    ); // remove from counter

    const interceptors = useMemo(
      () => ({
        request: (config) => (inc(), config),
        response: (response) => (dec(), response),
        error: (error) => ((dec(), Promise.reject(error))),
      }),
      [inc, dec]
    ); // create the interceptors

    useEffect(() => {
      // add request interceptors
      const reqInterceptor = axios.interceptors.request.use(
        interceptors.request,
        interceptors.error
      );
      // add response interceptors
      const resInterceptor = axios.interceptors.response.use(
        interceptors.response,
        interceptors.error
      );
      return () => {
        // remove all intercepts when done
        axios.interceptors.request.eject(reqInterceptor);
        axios.interceptors.response.eject(resInterceptor);
      };
    }, [interceptors]);

    return [counter > 0];
  };

  const GlobalLoader = () => {
    const [loading] = useAxiosLoader();
    const styles = {
      display: "flex",
      justifyContent: "center",
      position: "fixed",
      alignItems: "center",
      height: "100%",
      backgroundColor: "rgb(40 40 40 / 70%)",
      width: "100%",
      zIndex: "9999",
    };
    return (
      <div>
        {loading ? (
          <div style={styles}>
            <FadeLoader color="#FFFFFF" loading={true} size={25} />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  return (
    <>
      <BaseUrlManagement>
        <GlobalLoader />
        <AppRoutes />
      </BaseUrlManagement>
    </>
  );
}

export default withProviders(UserContext, ToastContext, SignalRContext)(App);
