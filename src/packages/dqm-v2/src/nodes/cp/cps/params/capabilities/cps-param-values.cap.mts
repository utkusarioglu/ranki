// import type {
//   AstSourceView,
//   ICpsParamValue,
//   ParamDefaultValue,
// } from "@dqm/package-dqm-api-v2";
// import { DqmAppError } from "../../../../../errors/dqm-app-error/dqm-app-error.mjs";

// export function cpsParamValuesCapability<T>(self: T) {
//   let defaultValues: ParamDefaultValue[] = [];
//   let mergedValues: ICpsParamValue;

//   return {
//     setDefaultValues(valueSpec: ParamDefaultValue[]): T {
//       defaultValues = valueSpec;
//       return self;
//     },

//     getDefaultValues(): ParamDefaultValue[] {
//       return defaultValues;
//     },

//     getMergedValues(astValues: AstSourceView[] | null): ICpsParamValue {
//       this.mergeValues(astValues);
//       return mergedValues;
//     },

//     /**
//      * @dev
//      * #1 Ast type determination is done by the grammar. Default value type is
//      * reported by the plugin itself.
//      */
//     mergeValues(astValues: AstSourceView[] | null) {
//       if (!astValues) {
//         mergedValues = defaultValues.map((d) => ({
//           type: d.type,
//           name: d.name,
//           defaultValue: d.defaultValue,
//           value: d.defaultValue,
//         }));
//         return;
//       }
//       this.checkValueLength(astValues);
//       mergedValues = [];
//       defaultValues.forEach((dv, i) => {
//         const av = astValues[i];
//         if (!av) {
//           mergedValues.push({
//             type: dv.type,
//             name: dv.name,
//             defaultValue: dv.defaultValue,
//             value: dv.defaultValue,
//           });
//           return;
//         }
//         // #1
//         if (av.type !== dv.type) {
//           throw new DqmAppError({
//             code: "INCONSISTENT_TYPE",
//             why: "Reported types of the default and the user values do not match",
//             cause: null,
//             details: {
//               astValues,
//               defaultValues,
//               currentDefaultValue: dv,
//               currentAstValue: av,
//             },
//           });
//         }
//         mergedValues.push({
//           type: dv.type,
//           subtype: av.subType,
//           name: dv.name,
//           defaultValue: dv.defaultValue,
//           value: av.value,
//         });
//       });
//     },

//     checkValueLength(astValues: AstSourceView[]) {
//       if (astValues.length > defaultValues.length) {
//         throw new DqmAppError({
//           code: "TOO_MANY_VALUES",
//           why: "Params are tuples and cannot define larger arrays than their default values",
//           cause: null,
//           details: {
//             values: astValues,
//             defaults: defaultValues,
//           },
//         });
//       }
//     },
//   };
// }
