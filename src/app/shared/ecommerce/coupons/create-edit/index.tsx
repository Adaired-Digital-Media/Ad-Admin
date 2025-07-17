"use client";

import cn from "@/core/utils/class-names";
import { couponActionsAtom } from "@/store/atoms/coupons.atom";
import { useSetAtom } from "jotai";
import React, { useState } from "react";
import { Loader } from "rizzui";
import { Element } from "react-scroll";
import FormNav, {
  formParts,
} from "@/app/shared/ecommerce/coupons/create-edit/form-nav";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  couponFormSchema,
  CouponFormValues,
} from "@/validators/create-coupon.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponDefaultValues } from "@/app/shared/ecommerce/coupons/create-edit/form-utils";
import FormFooter from "@/core/components/form-footer";
import BasicInformation from "./basic-information";
import DiscountSettings from "./discount-settings";
import ApplicabilityConditions from "./applicability-conditions";
import UsageLimits from "./usage-limits";
import { useRouter } from "next/navigation";
import { CouponTypes } from "@/core/types";
import toast from "react-hot-toast";
import { routes } from "@/config/routes";

const MAP_STEP_TO_COMPONENT = {
  [formParts.basicInfo]: BasicInformation,
  [formParts.discountSettings]: DiscountSettings,
  [formParts.applicabilityConditions]: ApplicabilityConditions,
  [formParts.usageLimits]: UsageLimits,
};

type Props = {
  className?: string;
  coupon?: CouponTypes;
  accessToken?: string;
};

const CreateEditCoupon = ({ className, coupon, accessToken }: Props) => {
  const router = useRouter();
  const setCoupons = useSetAtom(couponActionsAtom);
  const [isLoading, setLoading] = useState(false);

  const methods = useForm({
    resolver: zodResolver(couponFormSchema),
    defaultValues: couponDefaultValues(coupon),
  });

  const { handleSubmit } = methods;

  if (!coupon && isLoading) {
    return (
      <div
        className={cn(
          `@container h-full w-full flex items-center justify-center`,
          className
        )}
      >
        <Loader variant="spinner" size="xl" />
      </div>
    );
  }

  const onSubmit: SubmitHandler<CouponFormValues> = async (data) => {
    if (!accessToken) return;

    setLoading(true);
    try {
      if (coupon) {
        const response = await setCoupons({
          type: "update",
          token: accessToken,
          payload: { id: coupon._id, ...data },
        });
        if (!response.success) {
          toast.error(response.message);
          console.error("Failed to update coupon:", response);
          setLoading(false);
          return;
        }
        toast.success(response.message);
        router.push(routes.coupons.allCoupons);
      } else {
        const response = await setCoupons({
          type: "create",
          token: accessToken,
          payload: data,
        });
        if (!response.success) {
          toast.error(response.message);
          console.error("Failed to create coupon:", response);
          setLoading(false);
          return;
        }
        toast.success(response.message);
        router.push(routes.coupons.allCoupons);
      }
    } catch (error) {
      console.error("Failed to save coupon:", error);
    } finally {
      setLoading(false);
    }
  };

  // New handler for handleAltBtn to save with status "Inactive"
  // const handleSaveAsInactive = async () => {
  //   setLoading(true);
  //   try {
  //     const currentData = methods.getValues(); // Get current form values
  //     const payload: CouponTypes = {
  //       ...currentData,
  //       status: "Inactive", // Override status to "Inactive"
  //       expiresAt: currentData.expiresAt ? new Date(currentData.expiresAt) : undefined,
  //     };

  //     if (couponId) {
  //       await setCoupons({
  //         type: "update",
  //         id: couponId,
  //         accessToken: accessToken as string,
  //         payload,
  //       });
  //     } else {
  //       await setCoupons({
  //         type: "create",
  //         accessToken: accessToken as string,
  //         payload,
  //       });
  //       reset(couponDefaultValues(undefined), {
  //         keepDefaultValues: false,
  //         keepDirty: false,
  //         keepTouched: false,
  //         keepErrors: false,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Failed to save coupon as inactive:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className={cn(`@container`, className)}>
      <FormNav />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
            {Object.entries(MAP_STEP_TO_COMPONENT).map(([key, Component]) => (
              <Element
                key={key}
                name={formParts[key as keyof typeof formParts]}
              >
                <Component className="pt-7 @2xl:pt-9 @3xl:pt-11" />
              </Element>
            ))}
          </div>
          <FormFooter
            isLoading={isLoading}
            altBtnText="Save as Inactive"
            // handleAltBtn={handleSaveAsInactive}
            submitBtnText={coupon ? "Update Coupon" : "Create Coupon"}
          />
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateEditCoupon;
