"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitDeveloperconnectConnection = void 0;
const pulumi = __importStar(require("@pulumi/pulumi"));
const gcp = __importStar(require("@pulumi/gcp"));
const secretmanager = __importStar(require("@pulumi/gcp/secretmanager"));
const developerconnect = __importStar(require("@pulumi/gcp/developerconnect"));
/**
 * GitDeveloperconnectConnection Component Resource
 * Sets up a Developer Connect connection to GitHub, provisions the necessary IAM policy
 * for the Developer Connect service agent to access the GitHub token secret, and links it.
 */
class GitDeveloperconnectConnection extends pulumi.ComponentResource {
    constructor(name, args, opts) {
        super("custom:components:GitDeveloperconnectConnection", name, args, opts);
        // Get the existing Secret resource using its ID/Path
        const githubAccessTokenSecret = secretmanager.Secret.get(`${name}-access-token`, args.githubAccessTokenId, {}, { parent: this });
        // 1. Get/Create the Developer Connect Service Identity
        const devconnectServiceIdentity = new gcp.projects.ServiceIdentity(`${name}-identity`, {
            service: "developerconnect.googleapis.com",
        }, { parent: this });
        // 2. Create a non-destructive single member IAM policy binding for the service account
        const secretPolicyBinding = new secretmanager.SecretIamMember(`${name}-policy`, {
            secretId: githubAccessTokenSecret.secretId,
            role: "roles/secretmanager.secretAccessor",
            member: devconnectServiceIdentity.member,
        }, { parent: this });
        const oauthTokenSecretVersion = pulumi.all([args.projectId, githubAccessTokenSecret.id]).apply(([proj, id]) => {
            if (id.startsWith("projects/")) {
                return `${id}/versions/1`;
            }
            return `projects/${proj}/secrets/${id}/versions/1`;
        });
        // 4. Create the Developer Connect Connection
        this.connection = new developerconnect.Connection(name, {
            location: args.location,
            connectionId: args.connectionId,
            githubConfig: {
                githubApp: "DEVELOPER_CONNECT",
                appInstallationId: args.appInstallationId,
                authorizerCredential: {
                    oauthTokenSecretVersion,
                },
            },
        }, { parent: this, dependsOn: [secretPolicyBinding] });
        this.registerOutputs({
            connection: this.connection,
        });
    }
}
exports.GitDeveloperconnectConnection = GitDeveloperconnectConnection;
//# sourceMappingURL=git-developerconnect-connection.js.map