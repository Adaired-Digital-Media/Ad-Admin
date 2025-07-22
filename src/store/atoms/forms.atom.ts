/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom } from "jotai";
import axios from "axios";
import { FormType, FieldType } from "@/core/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URI;

// State atoms
export const formsAtom = atom<FormType[]>([]);

export const fieldsAtom = atom<FieldType[]>([]);

// Helper function for API calls
const apiRequest = async (
  method: "get" | "post" | "patch" | "delete",
  endpoint: string,
  token: string,
  data?: any
) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data,
    });
    return response.data;
  } catch (error) {
    console.error(`API ${method.toUpperCase()} error:`, error);
    throw error;
  }
};

// Union type for action payloads
type FormFieldActionPayload =
  | {
      type:
        | "fetchAllForms"
        | "fetchSingleForm"
        | "createForm"
        | "updateForm"
        | "deleteForm";
      token: string;
      payload?: {
        formId?: string;
        formIds?: string[];
        productType?: string;
        title?: string;
        fields?: Array<{ field: string; fieldOrder: number }>;
        status?: "active" | "inactive";
      };
    }
  | {
      type:
        | "fetchAllFields"
        | "fetchSingleField"
        | "createField"
        | "updateField"
        | "deleteField";
      token: string;
      payload?: {
        fieldId?: string;
        fieldIds?: string[];
        name?: string;
        label?: string;
        inputType?: string;
        inputMinLength?: number | null;
        inputMaxLength?: number | null;
        inputPlaceholder?: string | null;
        inputValidationPattern?: string | null;
        inputRequired?: boolean;
        customClassName?: string | null;
        multipleOptions?: Array<{ value: string; name: string }>;
      };
    };

// Combined atom for all form and field actions
export const formFieldActionsAtom = atom(
  null,
  async (get, set, action: FormFieldActionPayload) => {
    switch (action.type) {
      case "createForm": {
        const data = await apiRequest(
          "post",
          "/product/form/create-form",
          action.token,
          action.payload
        );
        set(formsAtom, (prev) => [data.form, ...prev]);
        await fetch("/api/revalidateTags?tags=forms");
        return data;
      }

      case "fetchAllForms": {
        const data = await apiRequest(
          "get",
          "/product/form/read-form",
          action.token
        );
        set(formsAtom, data.forms || []);
        return data;
      }

      case "fetchSingleForm": {
        const { formId } = action.payload || {};
        if (!formId) throw new Error("formId is required");
        const data = await apiRequest(
          "get",
          `/product/form/read-form?formId=${formId}`,
          action.token
        );
        return data;
      }

      case "updateForm": {
        const { formId, ...updateData } = action.payload || {};
        if (!formId) throw new Error("formId is required");
        const data = await apiRequest(
          "patch",
          `/product/form/update-form?formId=${formId}`,
          action.token,
          updateData
        );
        set(formsAtom, (prev) =>
          prev.map((f) =>
            f._id === formId ? { ...f, ...data.form, _id: f._id } : f
          )
        );
        await fetch("/api/revalidateTags?tags=forms");
        return data;
      }

      case "deleteForm": {
        const { formId } = action.payload || {};
        if (!formId) throw new Error("formId is required");
        const res = await apiRequest(
          "delete",
          `/product/form/delete-form?formId=${formId}`,
          action.token
        );
        set(formsAtom, (prev) => prev.filter((f) => f._id !== formId));
        await fetch("/api/revalidateTags?tags=forms", { method: "GET" });
        return res;
      }

      // Field Actions
      case "fetchAllFields": {
        const data = await apiRequest(
          "get",
          "/product/form/read-fields",
          action.token
        );
        set(fieldsAtom, data.fields || []);
        return data;
      }

      case "fetchSingleField": {
        const { fieldId } = action.payload || {};
        if (!fieldId) throw new Error("fieldId is required");
        const data = await apiRequest(
          "get",
          `/product/form/read-fields?fieldId=${fieldId}`,
          action.token
        );
        return data;
      }

      case "createField": {
        const data = await apiRequest(
          "post",
          "/product/form/create-field",
          action.token,
          action.payload
        );
        set(fieldsAtom, (prev) => [data.field, ...prev]);
        await fetch("/api/revalidateTags?tags=fields", { method: "GET" });
        return data;
      }

      case "updateField": {
        const { fieldId, ...updateData } = action.payload || {};
        if (!fieldId) throw new Error("fieldId is required");
        const data = await apiRequest(
          "patch",
          `/product/form/update-field?fieldId=${fieldId}`,
          action.token,
          updateData
        );
        set(fieldsAtom, (prev) =>
          prev.map((f) =>
            f._id === fieldId ? { ...f, ...data.field, _id: f._id } : f
          )
        );
        await fetch("/api/revalidateTags?tags=fields", { method: "GET" });
        return data;
      }

      case "deleteField": {
        const { fieldId } = action.payload || {};
        if (!fieldId) throw new Error("fieldId is required");
        const res = await apiRequest(
          "delete",
          `/product/form/delete-field?fieldId=${fieldId}`,
          action.token
        );
        set(fieldsAtom, (prev) => prev.filter((f) => f._id !== fieldId));
        await fetch("/api/revalidateTags?tags=fields", { method: "GET" });
        return res;
      }
    }
  }
);

// Derived atoms for filtered data
export const activeFormsAtom = atom((get) =>
  get(formsAtom).filter((f) => f.status === "active")
);

export const inactiveFormsAtom = atom((get) =>
  get(formsAtom).filter((f) => f.status === "inactive")
);

export const requiredFieldsAtom = atom((get) =>
  get(fieldsAtom).filter((f) => f.inputRequired)
);

export const optionalFieldsAtom = atom((get) =>
  get(fieldsAtom).filter((f) => !f.inputRequired)
);

export const emailFieldsAtom = atom((get) =>
  get(fieldsAtom).filter((f) => f.inputValidationPattern === "email")
);

export const urlFieldsAtom = atom((get) =>
  get(fieldsAtom).filter((f) => f.inputValidationPattern === "url")
);
