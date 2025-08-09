export type RequestContext = {
    userId: string | null;
};
export declare const router: import("@trpc/server").TRPCRouterBuilder<{
    ctx: RequestContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}>;
export declare const publicProcedure: import("@trpc/server").TRPCProcedureBuilder<RequestContext, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: RequestContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    healthz: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: string;
        meta: object;
    }>;
    echo: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            message: string;
        };
        output: {
            message: string;
        };
        meta: object;
    }>;
    todos: import("@trpc/server").TRPCBuiltRouter<{
        ctx: RequestContext;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        list: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: import("./services/todos").Todo[];
            meta: object;
        }>;
    }>>;
}>>;
export type AppRouter = typeof appRouter;
