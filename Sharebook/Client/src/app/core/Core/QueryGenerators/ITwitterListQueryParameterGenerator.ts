﻿import {IListParameters} from "../../Public/Parameters/ListsClient/TwitterListParameters";
import StringBuilder from "../../../c#-objects/TypeScript.NET-Core/packages/Core/source/Text/StringBuilder";
import {ITwitterListIdentifier} from "../../Public/Models/Interfaces/ITwitterListIdentifier";
import {IGetTweetsFromListParameters} from "../../Public/Parameters/ListsClient/GetTweetsFromListParameters";
import {InjectionToken} from "@angular/core";
import {TwitterListQueryParameterGenerator} from "../../../controllers/TwitterLists/TwitterListQueryParameterGenerator";

export interface ITwitterListQueryParameterGenerator {
  generateIdentifierParameter(twitterListIdentifier: ITwitterListIdentifier): string;

  // User Parameters
  createTweetsFromListParameters(): IGetTweetsFromListParameters;

  // Query Parameters
  appendListIdentifierParameter(query: StringBuilder, listIdentifier: ITwitterListIdentifier): void;

  appendListIdentifierParameter(query: StringBuilder, parameters: IListParameters): void;
}

export const ITwitterListQueryParameterGeneratorToken = new InjectionToken<ITwitterListQueryParameterGenerator>('ITwitterListQueryParameterGenerator', {
  providedIn: 'root',
  factory: () => new TwitterListQueryParameterGenerator(),
});
