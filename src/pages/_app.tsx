import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { ThemeProvider, createTheme } from "@mui/material";
import { themeOptions } from "../styles/theme";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider theme={createTheme(themeOptions)}>
      <SessionProvider session={session}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Component {...pageProps} />
        </LocalizationProvider>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
