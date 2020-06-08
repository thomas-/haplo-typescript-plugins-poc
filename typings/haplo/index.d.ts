
// Hacky way to include platform bundled underscore 
// without explicitly referencing...
declare namespace _ {
}

// export default Haplo;

declare namespace Haplo {
  interface LooseObject {
      [key: string]: any
  }
  type tableConstructor<U> = (name: string, fields: {[key: string]: Database.FieldDefinition}) => Database.Table<U>
  namespace Plugin {
    export interface ParametersAndPathElements {
      as: string;
      pathElement?: number;
      parameter?: string;
      optional?: boolean;
      workType?: string;
    }
  }
  export interface Plugin {
    implementService(s: string, x:(...args: any[]) => void): any;
    hook(hook: string, fn:(...args: any[]) => void): any;
    hook(
      hook: "hObjectDisplay",
      fn:(response: {
        hideModificationInfo: boolean,
        buttons: {
          [key: string]: [string, string][]
        }
      }, object: Haplo.StoreObject) => void
    ): void;
    respond(
      methods: string,
      path: string,
      parametersAndPathElements: Haplo.Plugin.ParametersAndPathElements[],
      handler: (exchange: Haplo.Exchange, ...args: any[]) => void
    ): void;
    db: {
      table<U>(name: string, fields: {[key: string]: Haplo.Database.FieldDefinition}): Haplo.Database.Table<U>,
      // Slightly hacky workaround for this... using any
      // [key: string]: Haplo.Database.Table<Haplo.Database.RowLoose> | tableConstructor<Haplo.Database.RowLoose>
      [key: string]: Haplo.Database.Table<Haplo.Database.RowLoose> | any;
    }
    globalTemplateFunction(s: string, fn:(...args: any[]) => void | string): void;
    defaultLocaleId: string;
    locale(): Locale;
    locale(localeId: string): Locale;
    template(templateName: string): Template;
    workUnit(implementation: {
      workType: string,
      description: string,
      notify?(workUnit: WorkUnit): LooseObject,
      render(W: any): void // TODO: https://docs.haplo.org/plugin/interface/plugin-work-unit-renderer
    }): void;
    // [x: string]: any;
  }
  namespace Database {
    export interface FieldDefinition {
      type: string,
      // https://stackoverflow.com/questions/41705559/dynamically-resolve-property-type-based-on-another-property-value-in-typescript
      linkedType?: string,
      caseInsensitive?: boolean,
      indexed?: boolean,
      uniqueIndex?: boolean,
      indexedWith?: string[]
    }
    export interface Table<U>{
      name: string,
      // create(initialValues: {[key: string]: any}): Row<U>;
      create(initialValues: {[P in keyof U]?: U[P]}): U & Row;
      // load(id: number): Row<U>;
      load(id: number): U;
      select(): Haplo.Database.Query<U>;
      deleteRow(id: number): boolean;
    }
    export interface Row {
      id: number,
      save(): this;
      deleteObject(): boolean;
      // [P in keyof U]: any;
    }
    export interface RowLoose extends Row {
      [key: string]: any;
    }
    export interface Query<U> extends Array<U & Row> {
      where(
        fieldName: string,
        comparison: "=" | "<" | ">" | "<=" | ">=" | "<>" | "LIKE",
        value: any
      ): this;
      or(fn: Query<U>): this;
      and(fn: Query<U>): this;
      include(fieldName: string): this;
      order(fieldName: string): this;
      order(fieldName: string, descending: boolean): this;
      stableOrder(): this;
      limit(count: number): this;
      offset(start: number): this;
      count(): number;
      aggregate(
        functionName: "AVG" | "COUNT" | "MAX" | "MIN" | "SUM" | "STDDEV_POP" | "STDDEV_SAMP" | "VAR_POP" | "VAR_SAMP",
        fieldName: string,
        groupByFieldNames: string[] | string

      ): number | {value: number, group: {[key: string]: any}} // todo, any? check source
      // each(iterator: (row: Row<U>, index: number) => void): this;
      each(iterator: (row: U & Row, index: number) => void): this;
      deleteAll(): this;
      // TODO: update
    }
  }
  export interface O {
    PLUGIN_DEBUGGING_ENABLED: boolean;
    currentUser: Haplo.SecurityPrincipal;
    audit: any;
    email: {
      template(templateName: string): EmailTemplate;
    }
    service(s: string, ...args: any[]): any;
    serviceImplemented(s: string): any;
    stop(s?: string): void;
    file(s?: string): any;
    action(s: string): any;
    // todo: user/security principals
    user(id: number): any;
    isRef(ref: any): boolean;
    ref(refOrObjId: string | number): Ref;
    work: {
      create(workType: string): WorkUnit;
      create(properties: { // TODO: WorkUnit intersection type with forced workType
        workType: string,
        [key: string]: any
      }): WorkUnit;
      query(workType: string): WorkUnitQuery;
    }
  }
  export interface SCHEMA {
    getAttributeInfo(attribute: number): undefined | {
      name: "string",
      code: "string",
      shortName: "string",
      typecode: "string"
    };
  }
  export interface Template {
    render(view: LooseObject): string;
  }
  export interface EmailTemplate {
    name: string;
    code: string;
    deliver(toAddress: string, toName: string, subject: string, messageText: string): void;
    render(view: LooseObject): string;
  }
  export interface WorkUnit {
    id: number;
    tags: LooseObject;
    save(): void;
  }
  export interface WorkUnitQuery extends Array<WorkUnit> {
    actionableBy(user: SecurityPrincipal | number): this;
    /** Find work units which have the tag specified by the key and value. key must be a String, and value must be a String or null.

        Tag queries treat null and the empty string as equivalent, matching tags which are not set or have the empty value, for consistency with the countByTags() function. */
    tag(key: string, value: string | null): this;
    /**
     * Find work units referring to the Ref.
     */
    ref(ref: Ref): this;
    isOpen(): this;
  }
  export interface StoreObject {
    // TODO: haplo 'value' type?
    // TODO: attribute ext
    each(desc: number, qual: number, iterator: (value: any, desc: number, qual: number) => void): void;
    each(desc: number, iterator: (value: any, desc: number, qual: number) => void): void;
    each(iterator: (value: any, desc: number, qual: number) => void): void;
    has(value: any, desc: number, qual: number): boolean;
    valuesEqual(object: StoreObject, desc: number, qual: number): boolean;
    isKindOf(typeRef: Haplo.Ref | undefined): boolean;
    ref: Haplo.Ref;
    history: StoreObject[];
    creationUid: number;
    creationDate: Date;
    lastModificationUid: number;
    lastModificationDate: Date;
    version: number;
  }
  export interface Ref {
    load(): StoreObject;
    toString(): string;
  }
  export interface SecurityPrincipal {
    name: string;
    email: string;
    ref: Ref | undefined;
    can(operation: "update" | "read" | "create" | "relabel" | "delete" | "approve", ref: Haplo.Ref): boolean;
  }
  export interface Locale {
    id: string;
    name: string;
    nameInLanguage: string;
    plugin: string;
    defaultForPlugin: boolean;
    text(category: string): LooseObject;
  }
  namespace Exchange {
    export interface Response {
      statusCode: number;
      body: any;
      kind: string;
      redirect(url: string): void;
    }
    export interface Request {
      method: string;
      path: string;
    }
  }
  export interface Exchange {
    response: Haplo.Exchange.Response;
    request: Haplo.Exchange.Request;
    render(view: object, template?: string): void;
  }
  namespace PluginLocalSchemaDict {
    export interface Type {
      [key: string]: Haplo.Ref;
    }
  }
  namespace Hook {

  }
}

declare var CAN_NOTIFY: number;

declare var P: Haplo.Plugin;

declare var O: Haplo.O;

declare var SCHEMA: Haplo.SCHEMA;

declare var T: Haplo.PluginLocalSchemaDict.Type;

declare var HTTP: any;
