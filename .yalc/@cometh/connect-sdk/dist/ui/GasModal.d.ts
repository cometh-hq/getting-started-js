interface GasModalConfig {
    zIndex?: string;
}
export declare class GasModal {
    readonly modalConfig: GasModalConfig;
    constructor(modalConfig?: GasModalConfig);
    private createModalWrapper;
    closeModal(): void;
    initModal(balance: string, txGasFees: string): Promise<boolean>;
}
export {};
