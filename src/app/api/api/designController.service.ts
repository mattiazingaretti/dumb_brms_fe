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
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';

import { Observable }                                        from 'rxjs';

import { PostedResourceDTO } from '../model/postedResourceDTO';
import { RuleDataResponseDTO } from '../model/ruleDataResponseDTO';
import { RuleDataTypesDTO } from '../model/ruleDataTypesDTO';
import { RuleInputRequestDTO } from '../model/ruleInputRequestDTO';
import { RuleInputResponseDTO } from '../model/ruleInputResponseDTO';
import { RuleOutputRequestDTO } from '../model/ruleOutputRequestDTO';
import { RuleOutputResponseDTO } from '../model/ruleOutputResponseDTO';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class DesignControllerService {

    protected basePath = 'http://localhost:8080';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * 
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public addRuleInputData(body: Array<RuleInputRequestDTO>, observe?: 'body', reportProgress?: boolean): Observable<PostedResourceDTO>;
    public addRuleInputData(body: Array<RuleInputRequestDTO>, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PostedResourceDTO>>;
    public addRuleInputData(body: Array<RuleInputRequestDTO>, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PostedResourceDTO>>;
    public addRuleInputData(body: Array<RuleInputRequestDTO>, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling addRuleInputData.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<PostedResourceDTO>('post',`${this.basePath}/design/addRuleInputData`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public addRuleOutputData(body: Array<RuleOutputRequestDTO>, observe?: 'body', reportProgress?: boolean): Observable<PostedResourceDTO>;
    public addRuleOutputData(body: Array<RuleOutputRequestDTO>, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<PostedResourceDTO>>;
    public addRuleOutputData(body: Array<RuleOutputRequestDTO>, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<PostedResourceDTO>>;
    public addRuleOutputData(body: Array<RuleOutputRequestDTO>, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling addRuleOutputData.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<PostedResourceDTO>('post',`${this.basePath}/design/addRuleOutputData`,
            {
                body: body,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getDataTypes(observe?: 'body', reportProgress?: boolean): Observable<Array<RuleDataTypesDTO>>;
    public getDataTypes(observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<RuleDataTypesDTO>>>;
    public getDataTypes(observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<RuleDataTypesDTO>>>;
    public getDataTypes(observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<Array<RuleDataTypesDTO>>('get',`${this.basePath}/design/getDataTypes`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param projectId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getRuleData(projectId: number, observe?: 'body', reportProgress?: boolean): Observable<RuleDataResponseDTO>;
    public getRuleData(projectId: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<RuleDataResponseDTO>>;
    public getRuleData(projectId: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<RuleDataResponseDTO>>;
    public getRuleData(projectId: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (projectId === null || projectId === undefined) {
            throw new Error('Required parameter projectId was null or undefined when calling getRuleData.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<RuleDataResponseDTO>('get',`${this.basePath}/design/getRuleData/${encodeURIComponent(String(projectId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param projectId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getRuleInputData(projectId: number, observe?: 'body', reportProgress?: boolean): Observable<Array<RuleInputResponseDTO>>;
    public getRuleInputData(projectId: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<RuleInputResponseDTO>>>;
    public getRuleInputData(projectId: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<RuleInputResponseDTO>>>;
    public getRuleInputData(projectId: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (projectId === null || projectId === undefined) {
            throw new Error('Required parameter projectId was null or undefined when calling getRuleInputData.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<Array<RuleInputResponseDTO>>('get',`${this.basePath}/design/getRuleInputData/${encodeURIComponent(String(projectId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * 
     * 
     * @param projectId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getRuleOutputData(projectId: number, observe?: 'body', reportProgress?: boolean): Observable<Array<RuleOutputResponseDTO>>;
    public getRuleOutputData(projectId: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<RuleOutputResponseDTO>>>;
    public getRuleOutputData(projectId: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<RuleOutputResponseDTO>>>;
    public getRuleOutputData(projectId: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (projectId === null || projectId === undefined) {
            throw new Error('Required parameter projectId was null or undefined when calling getRuleOutputData.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.request<Array<RuleOutputResponseDTO>>('get',`${this.basePath}/design/getRuleOutputData/${encodeURIComponent(String(projectId))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
