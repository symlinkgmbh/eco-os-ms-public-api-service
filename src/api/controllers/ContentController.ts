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




import { injectContentClient, injectUserClient } from "@symlinkde/eco-os-pk-core";
import { ITokenRequest } from "../../infrastructure/protection/ITokenRequest";
import { ApiResponseBuilder, CustomRestError } from "@symlinkde/eco-os-pk-api";
import { PkCore, PkApi, MsContent, MsFederation, PkHooks, MsUser } from "@symlinkde/eco-os-pk-models";
import { isArray } from "util";
import { IRegisterValidator, RegisterValidator } from "../../infrastructure/register";
import { StaticCommunityDetection, IFederationBlacklist, FederationBlacklist } from "../../infrastructure/utils";
import { injectFederationHooks } from "@symlinkde/eco-os-pk-hooks";

@injectUserClient
@injectFederationHooks
@injectContentClient
export class ContentController {
  private contentClient!: PkCore.IEcoContentClient;
  private registrationValidator: IRegisterValidator;
  private federationHooks!: PkHooks.IFederationHooks;
  private userClient!: PkCore.IEcoUserClient;
  private federationBlacklist: IFederationBlacklist;

  public constructor() {
    this.registrationValidator = new RegisterValidator();
    this.federationBlacklist = new FederationBlacklist();
  }

  // tslint:disable-next-line:cyclomatic-complexity
  public async addContent(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      if (!(await this.registrationValidator.isLocaleRegisteredDomainForContent(req.body.domain))) {
        if (await StaticCommunityDetection.isCommunity(req)) {
          const body: MsFederation.IFederationPostObject = req.body;

          if (
            await this.federationBlacklist.isDomainInFederationBlackist(body.domain === undefined ? "" : body.domain)
          ) {
            throw new CustomRestError(
              {
                code: 400,
                message: "domain is not approved for federation",
              },
              400,
            );
          }

          const result = await this.userClient.loadUserByEmail(req.decriptedToken.email);
          const user: MsUser.IUser = result.data;

          body.sendingDomain = user.email.split("@")[1];

          return ApiResponseBuilder.buildApiResponse(
            await this.federationHooks.postRemoteContentAsCommunity(body, {
              // TODO: CLEAN INTERFACE
              targetDomain: body.domain === undefined ? "" : body.domain,
              timeStamp: new Date().getTime(),
              to: user.email,
            }),
          );
        } else {
          const body: MsFederation.IFederationPostObject = req.body;

          if (
            await this.federationBlacklist.isDomainInFederationBlackist(body.domain === undefined ? "" : body.domain)
          ) {
            throw new CustomRestError(
              {
                code: 400,
                message: "domain is not approved for federation",
              },
              400,
            );
          }

          const result = await this.userClient.loadUserByEmail(req.decriptedToken.email);
          const user: MsUser.IUser = result.data;

          body.sendingDomain = user.email.split("@")[1];

          await this.postContent(req);
          return ApiResponseBuilder.buildApiResponse(
            await this.federationHooks.postRemoteContent(body, {
              // TODO: CLEAN INTERFACE
              targetDomain: body.domain === undefined ? "" : body.domain,
              timeStamp: new Date().getTime(),
              to: user.email,
            }),
          );
        }
      } else {
        if (!isArray(req.body)) {
          return await this.postContent(req);
        } else {
          return await this.postContentAsArray(req.body as Array<MsContent.IContent>);
        }
      }
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async getContent(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    try {
      if (req.params.checksum !== undefined && req.params.checksum !== null) {
        return ApiResponseBuilder.buildApiResponse(await this.contentClient.loadContent(req.params.checksum));
      }
      return ApiResponseBuilder.buildApiResponse(await this.contentClient.loadContent(req.body.checksum));
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  public async revokeOutdatedContent(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.contentClient.revokeOutdatedContent());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }

  private async postContentAsArray(content: Array<MsContent.IContent>): Promise<PkApi.IApiResponse> {
    return ApiResponseBuilder.buildApiResponse(await this.contentClient.createContent(content));
  }

  private async postContent(req: ITokenRequest): Promise<PkApi.IApiResponse> {
    return ApiResponseBuilder.buildApiResponse(
      await this.contentClient.createContent({
        checksum: req.body.checksum,
        key: req.body.key,
        domain: req.body.domain,
        liveTime: req.body.liveTime,
        maxOpen: req.body.maxOpen,
      }),
    );
  }
}
