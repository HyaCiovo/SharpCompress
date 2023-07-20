import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./router";
import './App.less'
// import { Link } from "react-router-dom";
import zhCN from 'antd/locale/zh_CN'
import { ConfigProvider, message } from "antd";

const App = () => {

  const queryClient = new QueryClient();

  message.config({
    top: 10,
    duration: 1,
    maxCount: 3,
    rtl: true,
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: '#99cc00',
          },
        }}
      >
        <div id="App" className="App">
          {/* <nav>
          <Link to="/">To Home</Link>
          /
          <Link to="about">To About</Link>
          /
          <Link to="test">To Test</Link>
        </nav> */}
          <Router />
        </div>
      </ConfigProvider>

    </QueryClientProvider>
  )
}

export default App
