/** 
* Copyright 2018-2019 Symlink GmbH 
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

import { MsAuth, PkCore } from "@symlinkde/eco-os-pk-models";
import { serviceContainer, ECO_OS_PK_CORE_TYPES } from "@symlinkde/eco-os-pk-core";
import { TokenService } from "@symlinkde/eco-os-pk-crypt";

export class ProtectionController {
  public static instance: ProtectionController;

  public static getInstance(): ProtectionController {
    if (!ProtectionController.instance) {
      ProtectionController.instance = new ProtectionController();
    }

    return ProtectionController.instance;
  }

  private configClient: PkCore.IEcoConfigClient;

  private constructor() {
    this.configClient = serviceContainer.get<PkCore.IEcoConfigClient>(ECO_OS_PK_CORE_TYPES.IEcoConfigClient);
  }

  public async validateToken(token: string): Promise<string | object> {
    const tokenConfig = await this.loadTokenSecret();
    const tokenService = new TokenService(tokenConfig.secret, tokenConfig.lifeTime);
    return await tokenService.verifyToken(token);
  }

  private async loadTokenSecret(): Promise<MsAuth.ITokenConfig> {
    const loadedConfig = await this.configClient.get("auth");
    const configObj: MsAuth.ITokenConfig = loadedConfig.data.auth;
    return configObj;
  }
}
