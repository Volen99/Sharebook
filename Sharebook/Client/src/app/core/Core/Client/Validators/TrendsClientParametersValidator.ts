import {IGetTrendsLocationCloseToParameters} from "../../../Public/Parameters/TrendsClient/GetTrendsLocationCloseToParameters";
import {IGetTrendsAtParameters} from "../../../Public/Parameters/TrendsClient/GetTrendsAtParameters";
import {IGetTrendsLocationParameters} from "../../../Public/Parameters/TrendsClient/GetTrendsLocationParameters";
import {ITrendsClientRequiredParametersValidator} from "./TrendsClientRequiredParametersValidator";
import {TrendsParameters} from "./parameters-types";
import {InjectionToken} from "@angular/core";

export interface ITrendsClientParametersValidator {
  validate(parameters: IGetTrendsLocationCloseToParameters): void;

  validate(parameters: IGetTrendsAtParameters): void;

  validate(parameters: IGetTrendsLocationParameters): void;
}

export const ITrendsClientParametersValidatorToken = new InjectionToken<ITrendsClientParametersValidator>('ITrendsClientParametersValidator', {
  providedIn: 'root',
  factory: () => new TrendsClientParametersValidator(),
});

export class TrendsClientParametersValidator implements ITrendsClientParametersValidator {
  private readonly _requiredParametersValidator: ITrendsClientRequiredParametersValidator;

  constructor(requiredParametersValidator: ITrendsClientRequiredParametersValidator) {
    this._requiredParametersValidator = requiredParametersValidator;
  }

  public validate(parameters: TrendsParameters): void {
    this._requiredParametersValidator.validate(parameters);
  }
}
