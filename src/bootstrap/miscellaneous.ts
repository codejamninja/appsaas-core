/**
 * File: /src/bootstrap/miscellaneous.ts
 * Project: example-nestjs
 * File Created: 22-01-2022 08:12:38
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 22-01-2022 08:40:09
 * Modified By: Clay Risser <email@clayrisser.com>
 * -----
 * Risser Labs LLC (c) Copyright 2021 - 2022
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
 */

import { NestEnlighten } from "nestjs-enlighten";
import { NestExpressApplication } from "@nestjs/platform-express";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { ConfigService } from "@nestjs/config";

export async function registerMiscellaneous(
  app: NestExpressApplication | NestFastifyApplication
) {
  if (app.get(ConfigService).get("DEBUG") === "1") {
    app.useGlobalFilters(new NestEnlighten({ theme: "theme-dark" }));
  }
}