import { wrapper } from "../redux/store";
import { ClientStoreProvider } from "../components/ClientStoreProvider";

const MyApp = ({ Component, pageProps }) => {
    return <ClientStoreProvider><Component {...pageProps} /></ClientStoreProvider>
}

export default wrapper.withRedux(MyApp);