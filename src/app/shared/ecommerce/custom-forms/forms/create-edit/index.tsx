// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { PiXBold } from "react-icons/pi";
// import { SubmitHandler } from "react-hook-form";
// import {
//   Input,
//   Button,
//   ActionIcon,
//   Title,
//   Checkbox,
//   cn,
//   Textarea,
// } from "rizzui";
// import {
//   createFormSchema,
//   CreateFormInput,
// } from "@/validators/create-form.schema";
// import { useModal } from "@/app/shared/modal-views/use-modal";
// import { Form } from "@/core/ui/form";
// import { useAtom } from "jotai";
// import { formFieldActionsAtom, fieldsAtom } from "@/store/atoms/forms.atom";
// import { Session } from "next-auth";
// import { FormType } from "@/data/productForms.types";
// import toast from "react-hot-toast";
// import ModalButton from "@/app/shared/modal-button";
// import CreateEditField from "../../fields/create-edit";

// export default function CreateEditForm({
//   form,
//   session,
//   className,
// }: {
//   form?: FormType;
//   session?: Session;
//   className?: string;
// }) {
//   const { closeModal } = useModal();
//   const [, dispatchAction] = useAtom(formFieldActionsAtom);
//   const [fields] = useAtom(fieldsAtom);
//   const [isLoading, setLoading] = useState(false);
//   const [selectedFields, setSelectedFields] = useState<
//     Array<{ field: string; fieldOrder: number }>
//   >(
//     form?.fields?.map((f) => ({
//       field: f.field._id,
//       fieldOrder: f.fieldOrder,
//     })) || []
//   );

//   // Track selected field IDs for checkbox state
//   const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>(
//     form?.fields?.map((f) => f.field._id) || []
//   );

//   useEffect(() => {
//     const fetchFields = async () => {
//       try {
//         await dispatchAction({
//           type: "fetchAllFields",
//           token: session?.user?.accessToken || "",
//         });
//       } catch (error) {
//         console.error("Failed to fetch fields:", error);
//       }
//     };
//     fetchFields();
//   }, [dispatchAction, session?.user?.accessToken]);

//   // Set default values for the form
//   const defaultValues: CreateFormInput = {
//     title: form?.title ?? "",
//     fields: selectedFields,
//   };

//   const handleCheckboxChange = (fieldId: string) => {
//     const isSelected = selectedFieldIds.includes(fieldId);
//     if (!isSelected) {
//       // Select field: add with next sequential fieldOrder
//       const maxOrder = Math.max(...selectedFields.map((f) => f.fieldOrder), 0);
//       setSelectedFields([
//         ...selectedFields,
//         {
//           field: fieldId,
//           fieldOrder: maxOrder + 1,
//         },
//       ]);
//       setSelectedFieldIds([...selectedFieldIds, fieldId]);
//     } else {
//       // Deselect field: remove and reassign fieldOrder sequentially
//       const updatedFields = selectedFields
//         .filter((f) => f.field !== fieldId)
//         .map((f, index) => ({
//           ...f,
//           fieldOrder: index + 1,
//         }));
//       setSelectedFields(updatedFields);
//       setSelectedFieldIds(selectedFieldIds.filter((id) => id !== fieldId));
//     }
//   };

//   const handleFieldOrderChange = (fieldId: string, value: number) => {
//     const updatedFields = [...selectedFields];
//     const fieldIndex = updatedFields.findIndex((f) => f.field === fieldId);
//     if (fieldIndex !== -1) {
//       updatedFields[fieldIndex] = {
//         ...updatedFields[fieldIndex],
//         fieldOrder: value,
//       };
//       setSelectedFields(updatedFields);
//     }
//   };

//   const onSubmit: SubmitHandler<CreateFormInput> = useCallback(
//     async (data) => {
//       setLoading(true);
//       try {
//         if (selectedFields.length === 0) {
//           toast.error("Please select at least one field.");
//           setLoading(false);
//           return;
//         }
//         const accessToken = session?.user?.accessToken || "";

//         // Sort fields by fieldOrder
//         const sortedFields = [...selectedFields].sort(
//           (a, b) => a.fieldOrder - b.fieldOrder
//         );

//         const payload = {
//           title: data.title,
//           fields: sortedFields.map((field) => ({
//             field: field.field,
//             fieldOrder: field.fieldOrder,
//           })),
//         };

//         console.log("Form payload:", payload);

//         if (form) {
//           await dispatchAction({
//             type: "updateForm",
//             token: accessToken,
//             payload: { formId: form._id, ...payload },
//           });
//           toast.success("Form updated successfully");
//         } else {
//           await dispatchAction({
//             type: "createForm",
//             token: accessToken,
//             payload,
//           });
//           toast.success("Form created successfully");
//         }
//         closeModal();
//       } catch (error) {
//         toast.error("Failed to submit form");
//         console.error("Form submission error:", error);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [
//       closeModal,
//       dispatchAction,
//       form,
//       selectedFields,
//       session?.user?.accessToken,
//     ]
//   );

//   return (
//     <Form<CreateFormInput>
//       validationSchema={createFormSchema}
//       useFormProps={{
//         defaultValues,
//       }}
//       onSubmit={onSubmit}
//       className={cn(
//         "grid grid-cols-1 gap-6 p-6 @container md:grid-cols-1 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900",
//         className
//       )}
//     >
//       {({ register, formState: { errors } }) => (
//         <>
//           <div className="col-span-full flex items-center justify-between">
//             <Title as="h4" className="font-semibold">
//               {form ? "Edit Form" : "Create New Form"}
//             </Title>
//             <ActionIcon size="sm" variant="text" onClick={closeModal}>
//               <PiXBold className="h-auto w-5" />
//             </ActionIcon>
//           </div>

//           <Input
//             label="Title"
//             type="text"
//             placeholder="Title"
//             {...register("title")}
//             error={errors.title?.message}
//             className="col-span-full w-full"
//           />

//           <div className="col-span-full">
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead className="bg-gray-100 text-gray-700 font-semibold sticky top-0 z-10">
//                   <tr>
//                     <th className="p-2 text-left" style={{ width: "50px" }}>
//                       Select
//                     </th>
//                     <th className="p-2 text-left" style={{ width: "200px" }}>
//                       Field Name
//                     </th>
//                     <th className="p-2 text-left" style={{ width: "300px" }}>
//                       Field View
//                     </th>
//                     <th className="p-2 text-left" style={{ width: "100px" }}>
//                       Field Order
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {fields.map((field) => (
//                     <tr key={field._id} className="border-t border-gray-200">
//                       <td className="p-2">
//                         <Checkbox
//                           checked={selectedFieldIds.includes(field._id)}
//                           onChange={() => handleCheckboxChange(field._id)}
//                           aria-label={`Select ${field.name}`}
//                         />
//                       </td>
//                       <td className="p-2">{field.name}</td>
//                       <td className="p-2">
//                         {field.inputType === "checkbox" ? (
//                           <Checkbox
//                             checked={field.inputRequired}
//                             readOnly
//                             label={field.label}
//                             className="bg-gray-200 border-none w-full"
//                           />
//                         ) : field.inputType === "textarea" ? (
//                           <Textarea
//                             value={field.label}
//                             readOnly
//                             size="sm"
//                             className="bg-gray-200 border-none w-full"
//                           />
//                         ) : (
//                           <Input
//                             value={field.label}
//                             type={field.inputType ?? "text"}
//                             readOnly
//                             className="bg-gray-200 border-none w-full"
//                           />
//                         )}
//                       </td>
//                       <td className="p-2">
//                         {selectedFieldIds.includes(field._id) ? (
//                           <Input
//                             type="number"
//                             value={
//                               selectedFields.find((f) => f.field === field._id)
//                                 ?.fieldOrder || 1
//                             }
//                             onChange={(e) =>
//                               handleFieldOrderChange(
//                                 field._id,
//                                 parseInt(e.target.value) || 1
//                               )
//                             }
//                             onBlur={(e) =>
//                               handleFieldOrderChange(
//                                 field._id,
//                                 parseInt(e.target.value) || 1
//                               )
//                             }
//                             min={1}
//                             className="w-full"
//                           />
//                         ) : null}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <p>{errors.fields?.message}</p>

//           <div className="col-span-full grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
//             <div className={cn(``)}>
//               <ModalButton
//                 label="Add New Field"
//                 view={<CreateEditField session={session!} />}
//                 modalSize="lg"
//                 className="mt-0"
//               />
//             </div>
//             <div
//               className={cn(`w-full 2xl:w-3/4 flex gap-4 lg:place-self-end`)}
//             >
//               <Button variant="outline" onClick={closeModal} className="w-full">
//                 Cancel
//               </Button>
//               <Button type="submit" isLoading={isLoading} className="w-full">
//                 {form ? "Update Form" : "Create Form"}
//               </Button>
//             </div>
//           </div>
//         </>
//       )}
//     </Form>
//   );
// }

"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { PiXBold } from "react-icons/pi";
import { SubmitHandler } from "react-hook-form";
import {
  Input,
  Button,
  ActionIcon,
  Title,
  Checkbox,
  cn,
  Textarea,
} from "rizzui";
import {
  createFormSchema,
  CreateFormInput,
} from "@/validators/create-form.schema";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { Form } from "@/core/ui/form";
import { useAtom } from "jotai";
import { formFieldActionsAtom, fieldsAtom } from "@/store/atoms/forms.atom";
import { Session } from "next-auth";
import { FieldType, FormType } from "@/data/productForms.types";
import toast from "react-hot-toast";
import ModalButton from "@/app/shared/modal-button";
import CreateEditField from "../../fields/create-edit";
import MainTable from "@core/components/table"; // Import the provided MainTable component
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";

export default function CreateEditForm({
  form,
  session,
  className,
}: {
  form?: FormType;
  session?: Session;
  className?: string;
}) {
  const { closeModal } = useModal();
  const [, dispatchAction] = useAtom(formFieldActionsAtom);
  const [fields] = useAtom(fieldsAtom);
  const [isLoading, setLoading] = useState(false);
  const [selectedFields, setSelectedFields] = useState<
    Array<{ field: string; fieldOrder: number }>
  >(
    form?.fields?.map((f) => ({
      field: f.field._id,
      fieldOrder: f.fieldOrder,
    })) || []
  );
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>(
    form?.fields?.map((f) => f.field._id) || []
  );

  // Memoized sorted fields for initial render in edit mode
  const sortedFields = useMemo(() => {
    if (!form) {
      // In create mode, return fields as is
      return fields;
    }

    // In edit mode, sort selected fields to the top by fieldOrder (initially)
    const initialSelectedFields =
      form.fields?.map((f) => ({
        field: f.field._id,
        fieldOrder: f.fieldOrder,
      })) || [];
    const initialSelectedFieldIds = initialSelectedFields.map((f) => f.field);

    const selected = fields
      .filter((field) => initialSelectedFieldIds.includes(field._id))
      .map((field) => ({
        ...field,
        fieldOrder:
          initialSelectedFields.find((sf) => sf.field === field._id)
            ?.fieldOrder || 0,
      }))
      .sort((a, b) => a.fieldOrder - b.fieldOrder); // Sort by fieldOrder

    const nonSelected = fields.filter(
      (field) => !initialSelectedFieldIds.includes(field._id)
    );

    // Combine selected fields (top) and non-selected fields (bottom)
    return [...selected, ...nonSelected];
  }, [fields, form]); // Only depend on fields and form

  useEffect(() => {
    const fetchFields = async () => {
      try {
        await dispatchAction({
          type: "fetchAllFields",
          token: session?.user?.accessToken || "",
        });
      } catch (error) {
        console.error("Failed to fetch fields:", error);
      }
    };
    fetchFields();
  }, [dispatchAction, session?.user?.accessToken]);

  const defaultValues: CreateFormInput = {
    title: form?.title ?? "",
    fields: selectedFields,
  };

  // const handleCheckboxChange = (fieldId: string) => {
  //   const isSelected = selectedFieldIds.includes(fieldId);
  //   if (!isSelected) {
  //     const maxOrder = Math.max(...selectedFields.map((f) => f.fieldOrder), 0);
  //     setSelectedFields([
  //       ...selectedFields,
  //       {
  //         field: fieldId,
  //         fieldOrder: maxOrder + 1,
  //       },
  //     ]);
  //     setSelectedFieldIds([...selectedFieldIds, fieldId]);
  //   } else {
  //     const updatedFields = selectedFields
  //       .filter((f) => f.field !== fieldId)
  //       .map((f, index) => ({
  //         ...f,
  //         fieldOrder: index + 1,
  //       }));
  //     setSelectedFields(updatedFields);
  //     setSelectedFieldIds(selectedFieldIds.filter((id) => id !== fieldId));
  //   }
  // };

  // const handleFieldOrderChange = (fieldId: string, value: number) => {
  //   const updatedFields = [...selectedFields];
  //   const fieldIndex = updatedFields.findIndex((f) => f.field === fieldId);
  //   if (fieldIndex !== -1) {
  //     updatedFields[fieldIndex] = {
  //       ...updatedFields[fieldIndex],
  //       fieldOrder: value,
  //     };
  //     setSelectedFields(updatedFields);
  //   }
  // };

  // Wrap handleCheckboxChange in useCallback
  const handleCheckboxChange = useCallback(
    (fieldId: string) => {
      const isSelected = selectedFieldIds.includes(fieldId);
      if (!isSelected) {
        const maxOrder = Math.max(
          ...selectedFields.map((f) => f.fieldOrder),
          0
        );
        setSelectedFields([
          ...selectedFields,
          {
            field: fieldId,
            fieldOrder: maxOrder + 1,
          },
        ]);
        setSelectedFieldIds([...selectedFieldIds, fieldId]);
      } else {
        const updatedFields = selectedFields
          .filter((f) => f.field !== fieldId)
          .map((f, index) => ({
            ...f,
            fieldOrder: index + 1,
          }));
        setSelectedFields(updatedFields);
        setSelectedFieldIds(selectedFieldIds.filter((id) => id !== fieldId));
      }
    },
    [selectedFieldIds, selectedFields]
  );

  // Wrap handleFieldOrderChange in useCallback
  const handleFieldOrderChange = useCallback(
    (fieldId: string, value: number) => {
      const updatedFields = [...selectedFields];
      const fieldIndex = updatedFields.findIndex((f) => f.field === fieldId);
      if (fieldIndex !== -1) {
        updatedFields[fieldIndex] = {
          ...updatedFields[fieldIndex],
          fieldOrder: value,
        };
        setSelectedFields(updatedFields);
      }
    },
    [selectedFields]
  );

  const onSubmit: SubmitHandler<CreateFormInput> = useCallback(
    async (data) => {
      setLoading(true);
      try {
        if (selectedFields.length === 0) {
          toast.error("Please select at least one field.");
          setLoading(false);
          return;
        }
        const accessToken = session?.user?.accessToken || "";
        const sortedFields = [...selectedFields].sort(
          (a, b) => a.fieldOrder - b.fieldOrder
        );

        const payload = {
          title: data.title,
          fields: sortedFields.map((field) => ({
            field: field.field,
            fieldOrder: field.fieldOrder,
          })),
        };

        console.log("Form payload:", payload);

        if (form) {
          await dispatchAction({
            type: "updateForm",
            token: accessToken,
            payload: { formId: form._id, ...payload },
          });
          toast.success("Form updated successfully");
        } else {
          await dispatchAction({
            type: "createForm",
            token: accessToken,
            payload,
          });
          toast.success("Form created successfully");
        }
        closeModal();
      } catch (error) {
        toast.error("Failed to submit form");
        console.error("Form submission error:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      closeModal,
      dispatchAction,
      form,
      selectedFields,
      session?.user?.accessToken,
    ]
  );

  // Define columns for the table
  const columnHelper = createColumnHelper<FieldType>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("_id", {
        header: "Select",
        size: 50,
        cell: ({ row }) => (
          <Checkbox
            checked={selectedFieldIds.includes(row.original._id)}
            onChange={() => handleCheckboxChange(row.original._id)}
            aria-label={`Select ${row.original.name}`}
          />
        ),
      }),
      columnHelper.accessor("name", {
        header: "Field Name",
        size: 200,
        cell: ({ getValue }) => <span>{getValue()}</span>,
      }),
      columnHelper.accessor("label", {
        header: "Field View",
        size: 300,
        cell: ({ row }) => {
          const { inputType, label, inputRequired } = row.original;
          return inputType === "checkbox" ? (
            <Checkbox
              checked={inputRequired}
              readOnly
              label={label}
              className="bg-gray-200 border-none w-full"
            />
          ) : inputType === "textarea" ? (
            <Textarea
              value={label}
              readOnly
              size="sm"
              className="bg-gray-200 border-none w-full"
            />
          ) : (
            <Input
              value={label}
              type={
                ([
                  "number",
                  "text",
                  "search",
                  "email",
                  "tel",
                  "url",
                  "time",
                  "date",
                  "week",
                  "month",
                  "datetime-local",
                ].includes(inputType ?? "")
                  ? inputType
                  : "text") as
                  | "number"
                  | "text"
                  | "search"
                  | "email"
                  | "tel"
                  | "url"
                  | "time"
                  | "date"
                  | "week"
                  | "month"
                  | "datetime-local"
                  | undefined
              }
              readOnly
              className="bg-gray-200 border-none w-full"
            />
          );
        },
      }),
      columnHelper.accessor("_id", {
        header: "Field Order",
        size: 100,
        cell: ({ row }) =>
          selectedFieldIds.includes(row.original._id) ? (
            <Input
              type="number"
              value={
                selectedFields.find((f) => f.field === row.original._id)
                  ?.fieldOrder || 1
              }
              onChange={(e) =>
                handleFieldOrderChange(
                  row.original._id,
                  parseInt(e.target.value) || 1
                )
              }
              onBlur={(e) =>
                handleFieldOrderChange(
                  row.original._id,
                  parseInt(e.target.value) || 1
                )
              }
              min={1}
              className="w-full"
            />
          ) : null,
      }),
    ],
    [
      columnHelper,
      handleCheckboxChange,
      handleFieldOrderChange,
      selectedFieldIds,
      selectedFields,
    ]
  );

  // Initialize react-table
  const table = useReactTable({
    data: sortedFields,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: false,
  });

  return (
    <Form<CreateFormInput>
      validationSchema={createFormSchema}
      useFormProps={{
        defaultValues,
      }}
      onSubmit={onSubmit}
      className={cn(
        "grid grid-cols-1 gap-6 p-6 @container md:grid-cols-1 [&_.rizzui-input-label]:font-medium [&_.rizzui-input-label]:text-gray-900",
        className
      )}
    >
      {({ register, formState: { errors } }) => (
        <>
          <div className="col-span-full flex items-center justify-between">
            <Title as="h4" className="font-semibold">
              {form ? "Edit Form" : "Create New Form"}
            </Title>
            <ActionIcon size="sm" variant="text" onClick={closeModal}>
              <PiXBold className="h-auto w-5" />
            </ActionIcon>
          </div>

          <Input
            label="Title"
            type="text"
            placeholder="Title"
            {...register("title")}
            error={errors.title?.message}
            className="col-span-full w-full"
          />

          <div className="col-span-full">
            <MainTable
              table={table}
              variant="modern"
              classNames={{
                headerClassName: "bg-gray-100 text-gray-700 font-semibold",
                cellClassName: "p-2 border-t border-gray-200",
                tableClassName: "w-full",
              }}
              stickyHeader
            />
          </div>

          <p>{errors.fields?.message}</p>

          <div className="col-span-full grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div className={cn(``)}>
              <ModalButton
                label="Add New Field"
                view={<CreateEditField session={session!} />}
                modalSize="lg"
                className="mt-0"
              />
            </div>
            <div
              className={cn(`w-full 2xl:w-3/4 flex gap-4 lg:place-self-end`)}
            >
              <Button variant="outline" onClick={closeModal} className="w-full">
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading} className="w-full">
                {form ? "Update Form" : "Create Form"}
              </Button>
            </div>
          </div>
        </>
      )}
    </Form>
  );
}
