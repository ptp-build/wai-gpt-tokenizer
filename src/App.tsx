import React, {useEffect} from 'react';
import BotWebSocket, {BotWebSocketNotifyAction, BotWebSocketState} from "./worker/msg/bot/BotWebSocket";
import Account from "./worker/share/Account";
import LocalStorage from "./worker/share/db/LocalStorage";
// @ts-ignore
const {$} = window
function App() {
    useEffect(()=>{
        const init = async ()=>{
            Account.setClientKv(new LocalStorage())
            const accountId = Account.getCurrentAccountId();
            const botWs = BotWebSocket.getInstance(accountId);
            const MSG_SERVER = "wss://wai-chat-bot.ptp-ai.workers.dev/ws"
            if (!botWs.isLogged()) {
                botWs.setMsgHandler(async (msgConnId, notifies) => {
                    for (let i = 0; i < notifies.length; i++) {
                        const {
                            action,
                            payload
                        } = notifies[i];
                        switch (action) {
                            case BotWebSocketNotifyAction.onConnectionStateChanged:
                                switch (payload.BotWebSocketState) {
                                    case BotWebSocketState.logged:
                                        break;
                                    case BotWebSocketState.connected:
                                        break;
                                    case BotWebSocketState.closed:
                                        break;
                                }
                                break;
                            case BotWebSocketNotifyAction.onData:
                                // console.log("[onData]",{accountId},getActionCommandsName(payload.getCommandId()))
                                break;
                        }
                    }
                });
                botWs.setWsUrl(MSG_SERVER);
                botWs.setSession(Account.getCurrentAccount()
                    ?.getSession()!);
                if (!botWs.isConnect()) {
                    botWs.connect();
                }
                if (botWs.isConnect() && !botWs.isLogged()) {
                    await botWs.login();
                }
                await botWs.waitForMsgServerState(BotWebSocketState.logged);
            }
        }
        init().catch(console.error)

    })
    console.log("LOAD FROM REACT",$)
    return (
    <div className="App">
      hi
    </div>
  );
}

export default App;
