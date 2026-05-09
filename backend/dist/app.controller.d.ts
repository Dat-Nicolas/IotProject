export declare class AppController {
    root(): {
        message: string;
        version: string;
        endpoints: {
            health: string;
            docs: string;
        };
    };
    health(): {
        status: string;
        service: string;
        timestamp: string;
    };
}
