/**
 * Copyright 2018-2020 Symlink GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */




import { IRegisterValidator } from "./IRegisterValidator";
import { Request } from "express";
import { StaticCommunityDetection, StaticSecondLockResolver } from "../utils";
import { injectConfigClient } from "@symlinkde/eco-os-pk-core";
import { PkCore, MsConf } from "@symlinkde/eco-os-pk-models";

@injectConfigClient
export class RegisterValidator implements IRegisterValidator {
  private configClient!: PkCore.IEcoConfigClient;

  public async isRegistrationAllowed(req: Request): Promise<boolean> {
    const isCommunity = await StaticCommunityDetection.isCommunity(req);
    const extractDomain = req.body.email.split("@")[1];
    const whiteList = await this.loadRegistrationWhitelist();

    const index = whiteList.findIndex((entry: string) => {
      return entry.toLowerCase().trim() === extractDomain.toLowerCase().trim();
    });

    if (index < 0) {
      return false;
    }

    if (isCommunity && index > -1) {
      return true;
    }

    return await StaticSecondLockResolver.hasDnsEntry(extractDomain);
  }

  public async isLocaleRegisteredDomain(req: Request): Promise<boolean> {
    const extractDomain = req.params.email.split("@")[1];
    const whiteList = await this.loadRegistrationWhitelist();

    const index = whiteList.findIndex((entry: string) => {
      return entry.toLowerCase().trim() === extractDomain.toLowerCase().trim();
    });

    if (index > -1) {
      return true;
    }

    return false;
  }

  public async isLocaleRegisteredDomainForContent(domain: string): Promise<boolean> {
    const whiteList = await this.loadRegistrationWhitelist();

    const index = whiteList.findIndex((entry: string) => {
      return entry.toLowerCase().trim() === domain.toLowerCase().trim();
    });

    if (index < 0) {
      return false;
    }

    return true;
  }

  public async processEula(req: Request): Promise<boolean> {
    const policies = await this.loadEulaConfig();
    if (!policies.shouldAcceptEula) {
      return true;
    }

    if (req.body.eula === true) {
      return true;
    }

    return false;
  }

  private async loadRegistrationWhitelist(): Promise<Array<string>> {
    const result = await this.configClient.get("allowedDomainsForRegistration");
    return result.data.allowedDomainsForRegistration;
  }

  private async loadEulaConfig(): Promise<MsConf.IPoliciesConfig> {
    const result = await this.configClient.get("policies");
    return <MsConf.IPoliciesConfig>Object(result.data.policies);
  }
}
