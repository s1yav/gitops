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
exports.GitCloudbuildConnection = void 0;
const pulumi = __importStar(require("@pulumi/pulumi"));
const gcp = __importStar(require("@pulumi/gcp"));
const cloudbuildv2 = __importStar(require("@pulumi/gcp/cloudbuildv2"));
const secretmanager = __importStar(require("@pulumi/gcp/secretmanager"));
/**
 * GitCloudbuildConnection Component Resource
 * Provisions a Secret Manager secret with the GitHub token, sets up the IAM permissions for
 * cloudbuild to access it, and creates the cloudbuild Gen 2 connection to GitHub.
 */
class GitCloudbuildConnection extends pulumi.ComponentResource {
    constructor(name, args, opts) {
        super("custom:components:GitCloudbuildConnection", name, args, opts);
        // Get the existing Secret resource using its ID/Path
        const githubAccessTokenSecret = secretmanager.Secret.get(`${name}-access-token`, args.githubAccessTokenId, {}, { parent: this });
        // 1. Get/Create the Cloud Build Service Identity
        const cloudbuildServiceIdentity = new gcp.projects.ServiceIdentity(`${name}-identity`, {
            service: "cloudbuild.googleapis.com",
        }, { parent: this });
        // 2. Create a non-destructive single member IAM policy binding for the service account
        const secretPolicyBinding = new secretmanager.SecretIamMember(`${name}-policy`, {
            secretId: githubAccessTokenSecret.secretId,
            role: "roles/secretmanager.secretAccessor",
            member: cloudbuildServiceIdentity.member,
        }, { parent: this });
        // Get the project details to retrieve the project number
        const project = gcp.organizations.getProjectOutput({
            projectId: args.projectId,
        });
        // Construct the second (modern) service identity member: service-PROJECT_NUMBER@gcp-sa-cloudbuild.iam.gserviceaccount.com
        const serviceAgentMember = project.number.apply(num => `serviceAccount:service-${num}@gcp-sa-cloudbuild.iam.gserviceaccount.com`);
        // Create policy binding for the modern service agent
        const serviceAgentSecretPolicyBinding = new secretmanager.SecretIamMember(`${name}-service-agent-policy`, {
            secretId: githubAccessTokenSecret.secretId,
            role: "roles/secretmanager.secretAccessor",
            member: serviceAgentMember,
        }, { parent: this });
        const oauthTokenSecretVersion = pulumi.all([args.projectId, githubAccessTokenSecret.id]).apply(([proj, id]) => {
            if (id.startsWith("projects/")) {
                return `${id}/versions/1`;
            }
            return `projects/${proj}/secrets/${id}/versions/1`;
        });
        // 4. Create the cloudbuild Gen 2 Connection
        this.connection = new cloudbuildv2.Connection(name, {
            location: args.location,
            name: args.connectionName,
            githubConfig: {
                appInstallationId: args.appInstallationId,
                authorizerCredential: {
                    oauthTokenSecretVersion,
                },
            },
        }, { parent: this, dependsOn: [secretPolicyBinding, serviceAgentSecretPolicyBinding] });
        // Only exports metadata IDs; the actual secret data remains secure in Secret Manager
        this.registerOutputs({
            connection: this.connection,
        });
    }
}
exports.GitCloudbuildConnection = GitCloudbuildConnection;
//# sourceMappingURL=git-cloudbuild-connection.js.map