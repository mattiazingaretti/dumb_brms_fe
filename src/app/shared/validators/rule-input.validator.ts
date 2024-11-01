import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


 // Custom Validator for dataIdentifier
 export function validateDataIdentifier(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isValid = /^[a-zA-Z0-9]{1,20}$/.test(value);
    const isSingleWord = !/\s/.test(value); 

    if (value && (!isValid || !isSingleWord)) {
      return { invalidDataIdentifier: true }; 
    }
    return null; 
  }

  // Custom Validator for dataIdentifier
 export function validateDataType(control: AbstractControl, knownCustomDataTypes: string[]): ValidationErrors | null {
    const value = control.value;
    
    const isList = value.length > 2 ? value.substring(value.length - 2) == '[]'  : false; //i.e. last 2 char are []  
    const isSet = value.length > 2 ? value.substring(value.length - 2) == '{}'  : false; //i.e. last 2 char are  {}  
    
    const isValidKnownCustom = knownCustomDataTypes.filter((known)=>{
        value === known || (isList && value === (known + '[]' )) || (isSet && value === (known + '{}' ))
    }).length > 0

    //TODO add validator when multiple cards are managed.
    value 

    const isValid = /^[a-zA-Z0-9]{1,20}$/.test(value); // regex checks only letters and numbers, max length of 20
    const isSingleWord = !/\s/.test(value); 

    if (value && (!isValid || !isSingleWord)) {
      return { invalidDataType: true };
    }
    return null; 
  }



export function validateTitle(defaultValue: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && value === defaultValue) {
      return { blank: true };
    }
    return null; 
  }
}