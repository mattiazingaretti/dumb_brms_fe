/**
 * OpenAPI definition
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { DumbFact } from './dumbFact';
import { DumbRule } from './dumbRule';

export interface ExecInDTO { 
    facts?: Array<DumbFact>;
    rules?: Array<DumbRule>;
}