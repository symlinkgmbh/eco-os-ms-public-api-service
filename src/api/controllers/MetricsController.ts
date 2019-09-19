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



import { ApiResponseBuilder, CustomRestError } from "@symlinkde/eco-os-pk-api";
import { injectMetricClient } from "@symlinkde/eco-os-pk-core";
import { PkCore, PkApi } from "@symlinkde/eco-os-pk-models";

@injectMetricClient
export class MetricsController {
  private metricClient!: PkCore.IEcoMetricsClient;

  public async getMemoryMetrics(): Promise<PkApi.IApiResponse> {
    try {
      return ApiResponseBuilder.buildApiResponse(await this.metricClient.getMemoryMetricsFromInfrastructure());
    } catch (err) {
      if (!err.response) {
        throw new CustomRestError(err, 500);
      }
      throw new CustomRestError(err.response.data.error, err.response.status);
    }
  }
}
