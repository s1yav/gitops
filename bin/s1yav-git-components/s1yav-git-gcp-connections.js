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
exports.gitCloudbuildConnection = void 0;
const pulumi = __importStar(require("@pulumi/pulumi"));
const git_cloudbuild_connection_1 = require("../constructs/git/git-cloudbuild-connection");
const gcpConfig = new pulumi.Config("gcp");
const gitConfig = new pulumi.Config("s1yav-git");
// Instantiate the custom GitCloudbuildConnection component resource
exports.gitCloudbuildConnection = new git_cloudbuild_connection_1.GitCloudbuildConnection("s1yav-GitCloudbuildConnection", {
    githubAccessTokenId: "github-access-token",
    location: gcpConfig.require("region"),
    connectionName: "s1yav-git-cloudbuild-connection",
    appInstallationId: gitConfig.requireSecret("cloudbuild-id").apply(id => {
        const parsed = parseInt(id, 10);
        if (isNaN(parsed)) {
            throw new Error(`cloudbuild-id is not a valid number: ${id}`);
        }
        return parsed;
    }),
    projectId: gcpConfig.require("project"),
});
//# sourceMappingURL=s1yav-git-gcp-connections.js.map