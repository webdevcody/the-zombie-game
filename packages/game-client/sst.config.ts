import { SSTConfig } from "sst";
import { StaticSite } from "sst/constructs";

export default {
  config() {
    return {
      name: "game-client",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const web = new StaticSite(stack, "web", {
        path: ".",
        buildOutput: "dist",
        buildCommand: "npm run build",
        environment: {},
      });

      stack.addOutputs({
        SiteUrl: web.url,
      });
    });
  },
} satisfies SSTConfig;
