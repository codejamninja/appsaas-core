/**
 * File: /src/modules/todo/todo.service.spec.ts
 * Project: example-nestjs
 * File Created: 02-01-2022 11:01:05
 * Author: Clay Risser <email@clayrisser.com>
 * -----
 * Last Modified: 06-01-2022 03:16:55
 * Modified By: Clay Risser <email@clayrisser.com>
 * -----
 * Silicon Hills LLC (c) Copyright 2021 - 2022
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

import { Test, TestingModule } from "@nestjs/testing";
import TodoService from "./todo.service";

describe("TodoService", () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService],
    }).compile();
    service = module.get<TodoService>(TodoService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
