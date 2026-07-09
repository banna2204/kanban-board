import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function trimValidator() : ValidatorFn {
  return (control : AbstractControl) : ValidationErrors  | null => {
    if(typeof control.value == 'string' && control.value.trim().length == 0){
      return {trimmed : true};
    }
    return null;
  }
}

export function sequenceValidator(validators : ValidatorFn[]) : ValidatorFn {
  return (control : AbstractControl) : ValidationErrors | null => {
    for(const validator of validators){
      if(validator(control)){
        return validator(control);
      }
    }
    return null;
  }
}