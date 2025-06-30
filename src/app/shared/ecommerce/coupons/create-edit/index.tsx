"use client";

import cn from "@/core/utils/class-names";
import { couponActionsAtom, couponsAtom } from "@/store/atoms/coupons.atom";
import { useAtom, useSetAtom } from "jotai";
import React, { useState, useEffect } from "react";
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

const MAP_STEP_TO_COMPONENT = {
  [formParts.basicInfo]: BasicInformation,
  [formParts.discountSettings]: DiscountSettings,
  [formParts.applicabilityConditions]: ApplicabilityConditions,
  [formParts.usageLimits]: UsageLimits,
};

type Props = {
  className?: string;
  couponId?: string;
  accessToken?: string;
};

const CreateEditCoupon = ({ className, couponId, accessToken }: Props) => {
  const [coupons] = useAtom(couponsAtom);
  const setCoupons = useSetAtom(couponActionsAtom);
  const [isLoading, setLoading] = useState(false);

  const coupon = coupons.find((c) => c?._id === couponId);

  const methods = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: couponDefaultValues(coupon),
  });

  const { handleSubmit, reset } = methods;

  // Fetch coupon data and reset form when coupon updates
  useEffect(() => {
    if (!couponId || !accessToken) return;

    if (!coupon) {
      setLoading(true);
      setCoupons({
        type: "fetchSingle",
        token: accessToken,
        payload: { couponId },
      }).finally(() => setLoading(false));
    } else {
      // Fully reset the form with fetched coupon data, clearing dirty state and errors
      reset(couponDefaultValues(coupon));
    }
  }, [couponId, accessToken, coupon, setCoupons, reset]);

  if (couponId && !coupon && isLoading) {
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
      if (couponId) {
        await setCoupons({
          type: "update",
          token: accessToken,
          payload: { id: couponId, ...data },
        });
      } else {
        await setCoupons({
          type: "create",
          token: accessToken,
          payload: data,
        });
        reset(couponDefaultValues(undefined));
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
            submitBtnText={couponId ? "Update Coupon" : "Create Coupon"}
          />
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateEditCoupon;
