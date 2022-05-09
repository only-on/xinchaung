export declare interface IWsOptions {
    url: string
    schema?: string | string[] | undefined
    open?: (ev: Event) => void
    close?: (ev: CloseEvent) => void
    error?: (ev: Event) => void
    message: (ev: MessageEvent, data: string) => void
}

export declare interface IWmc {
    ws: WebSocket
    close: (code?: number, reason?: string) => void
    join: (roomId: string) => void
    leave: (roomId: string) => void
    register: (userId: string) => void
    send: (to: string, type: string, message: string) => void
    broadcast: (message: string) => void
    sendRaw: (message: string) => void
    refresh: () => void
    isReset: () => boolean
}

export declare type TWmc = (options: IWsOptions) => IWmc

declare const Wmc: TWmc

export default Wmc
