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
exports.GitCloudbuildRepository = void 0;
const pulumi = __importStar(require("@pulumi/pulumi"));
const cloudbuildv2 = __importStar(require("@pulumi/gcp/cloudbuildv2"));
/**
 * GitCloudbuildRepository Component Resource
 * Links a GitHub repository to an existing Cloud Build Gen 2 connection.
 */
class GitCloudbuildRepository extends pulumi.ComponentResource {
    constructor(name, args, opts) {
        super("custom:components:GitCloudbuildRepository", name, args, opts);
        // Link the GitHub repository to the parent Cloud Build Connection
        this.repository = new cloudbuildv2.Repository(name, {
            location: args.location,
            name: args.repoName,
            parentConnection: args.parentConnection,
            remoteUri: pulumi.interpolate `https://github.com/${args.githubUsername}/${args.githubRepoName}.git`,
        }, { parent: this });
        this.registerOutputs({
            repository: this.repository,
        });
    }
}
exports.GitCloudbuildRepository = GitCloudbuildRepository;
//# sourceMappingURL=git-cloudbuild-repository.js.map