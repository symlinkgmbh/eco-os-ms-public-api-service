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



import { Application } from "express";
import { PkApi } from "@symlinkde/eco-os-pk-models";
import {
  Heartbeat,
  AccountRoute,
  AuthenticationRoute,
  ContentRoute,
  PasswordRoute,
  MeRoute,
  ActivationRoute,
  KeyRoute,
  RegisterRoute,
  ServiceRoute,
  ConfigRoute,
  LocalizationRoute,
  IpProtectionRoute,
  QueueRoute,
  MimeTypeRoute,
  MetricsRoute,
  MetricsLocaleRoute,
  CaptchaRoute,
  DeleteRoute,
  LicenseBeat,
  LicenseRoute,
  FederationRoute,
  ValidationRoute,
  ConfigBeat,
} from "./routes";

export class Router implements PkApi.IRouter {
  protected heartbeat: Heartbeat | undefined;
  protected licenseBeat: LicenseBeat | undefined;
  protected configBeat: ConfigBeat | undefined;
  protected accountRoute: AccountRoute | undefined;
  protected authenticationRoute: AuthenticationRoute | undefined;
  protected contentRoute: ContentRoute | undefined;
  protected passwordRoute: PasswordRoute | undefined;
  protected meRoute: MeRoute | undefined;
  protected activationRoute: ActivationRoute | undefined;
  protected keyRoute: KeyRoute | undefined;
  protected registerRoute: RegisterRoute | undefined;
  protected serviceRoute: ServiceRoute | undefined;
  protected configRoute: ConfigRoute | undefined;
  protected localizationRoute: LocalizationRoute | undefined;
  protected ipProtectionRoute: IpProtectionRoute | undefined;
  protected queueRoute: QueueRoute | undefined;
  protected mimeRoute: MimeTypeRoute | undefined;
  protected metricsRoute: MetricsRoute | undefined;
  protected metrics: MetricsLocaleRoute | undefined;
  protected captcha: CaptchaRoute | undefined;
  protected delete: DeleteRoute | undefined;
  protected license: LicenseRoute | undefined;
  protected federation: FederationRoute | undefined;
  protected validation: ValidationRoute | undefined;

  private app: Application;

  constructor(_app: Application) {
    this.app = _app;
  }

  public initRoutes(): void {
    this.heartbeat = new Heartbeat(this.app);
    this.licenseBeat = new LicenseBeat(this.app);
    this.accountRoute = new AccountRoute(this.app);
    this.authenticationRoute = new AuthenticationRoute(this.app);
    this.contentRoute = new ContentRoute(this.app);
    this.passwordRoute = new PasswordRoute(this.app);
    this.meRoute = new MeRoute(this.app);
    this.activationRoute = new ActivationRoute(this.app);
    this.keyRoute = new KeyRoute(this.app);
    this.registerRoute = new RegisterRoute(this.app);
    this.serviceRoute = new ServiceRoute(this.app);
    this.configRoute = new ConfigRoute(this.app);
    this.localizationRoute = new LocalizationRoute(this.app);
    this.ipProtectionRoute = new IpProtectionRoute(this.app);
    this.queueRoute = new QueueRoute(this.app);
    this.mimeRoute = new MimeTypeRoute(this.app);
    this.metricsRoute = new MetricsRoute(this.app);
    this.metrics = new MetricsLocaleRoute(this.app);
    this.captcha = new CaptchaRoute(this.app);
    this.delete = new DeleteRoute(this.app);
    this.license = new LicenseRoute(this.app);
    this.federation = new FederationRoute(this.app);
    this.validation = new ValidationRoute(this.app);
    this.configBeat = new ConfigBeat(this.app);
    return;
  }
}
