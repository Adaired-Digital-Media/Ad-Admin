export type FormType = {
  _id: string;
  productType: string;
  title: string;
  fields: Array<{
    field: {
      _id: string;
      name: string;
      label: string;
      inputType: string;
      inputValidationPattern?: string;
      inputRequired: boolean;
    };
    fieldOrder: number;
  }>;
  status: "Active" | "Inactive";
  createdBy: string;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type FieldType = {
  _id: string;
  name: string;
  label: string;
  inputType:
    | "number"
    | "email"
    | "url"
    | "date"
    | "time"
    | "tel"
    | "search"
    | "month"
    | "week"
    | "datetime-local"
    | "text"
    | "checkbox"
    | "textarea"
    | undefined;
  inputMinLength?: number | null;
  inputMaxLength?: number | null;
  inputPlaceholder?: string | null;
  inputValidationPattern?: string | null;
  inputRequired: boolean;
  customClassName?: string | null;
  multipleOptions?: Array<{
    value: string;
    name: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type FieldOption = {
  _id: string;
  name: string;
  label: string;
  inputType: string;
  inputValidationPattern?: "email" | "url" | null;
  inputRequired: boolean;
};
