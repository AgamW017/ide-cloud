import { Terminal as XTerminal } from "@xterm/xterm"
import { useEffect, useRef } from "react";
import '@xterm/xterm/css/xterm.css'
import socket from "../socket";
import { FitAddon } from '@xterm/addon-fit';

export default function Term() {
    const terminalRef = useRef();
    const isRendered = useRef(false);

    useEffect(() => {
        if (isRendered.current) return;
        isRendered.current = true;

        const term = new XTerminal(
            {
                cursorBlink: true,
                cursorStyle: "bar",
                fontSize: 16,
            }
        );
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(document.getElementById("term-cont"));
        fitAddon.fit();
        term.open(terminalRef.current)

        term.onData((data) => {
            socket.emit("terminal:write", data)
        })
        socket.on("terminal:data", (data) => {
            term.write(data);
        })
    })

    return (

        <div ref={terminalRef}></div>
    )
}
