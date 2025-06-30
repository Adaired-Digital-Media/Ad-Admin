"use client";

import cn from "@/core/utils/class-names";
import { CloudinaryFile } from "@/core/types";
import { useEffect, useState } from "react";
import FileCard from "./file-card";
import { AdvancedRadio, Button, RadioGroup } from "rizzui";
import { Skeleton } from "@/core/ui/skeleton";
import { useModal } from "@/app/shared/modal-views/use-modal";
import { useAtom, useSetAtom } from "jotai";
import {
  cloudinaryActionsAtom,
  cloudinaryFilesAtom,
} from "@/store/atoms/files.atom";
import { useSession } from "next-auth/react";

interface FileGridProps {
  onImageSelect: (image: CloudinaryFile) => void;
}

const FileGrid = ({ onImageSelect }: FileGridProps) => {
  const countPerPage = 12;
  const { data: session } = useSession();
  const [files] = useAtom(cloudinaryFilesAtom);
  const setFiles = useSetAtom(cloudinaryActionsAtom);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState(countPerPage);
  const [selectedImage, setSelectedImage] = useState<
    CloudinaryFile | undefined
  >(undefined);
  const { closeModal } = useModal();

  useEffect(() => {
    setFiles({
      type: "fetch",
      payload: {
        nextPage: 0,
        countPerPage,
      },
      token: session?.user?.accessToken ?? "",
    });
  }, [setFiles, session]);

  useEffect(() => {
    if (selectedImage) {
      onImageSelect(selectedImage);
      closeModal();
    }
  }, [selectedImage, onImageSelect, closeModal]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setLoadingMore(false);
      setNextPage((prev) => prev + countPerPage);
    }, 600);
  };

  // Skeleton grid component
  const SkeletonGrid = () => (
    <>
      <div
        className={cn(
          `grid grid-cols-1 gap-x-4 gap-y-5 
      @md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] 
      @xl:gap-x-6 @xl:gap-y-7 
      @4xl:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] 
      @6xl:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]`
        )}
      >
        {Array.from({ length: countPerPage }).map((_, index) => (
          <Skeleton key={index} className="h-[180px] w-full rounded-lg" />
        ))}
      </div>
    </>
  );

  return (
    <>
      <div className={cn(`@container`)}>
        {files.length === 0 ? (
          <SkeletonGrid />
        ) : (
          <>
            <RadioGroup
              value={selectedImage?.secure_url || ""}
              setValue={(value) =>
                setSelectedImage(
                  files.find((file) => file.secure_url === value)
                )
              }
              // onClick={() => closeModal()}
              className={cn(
                `grid grid-cols-1 gap-x-4 gap-y-5 
                @md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] 
                @xl:gap-x-6 @xl:gap-y-7 
                @4xl:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] 
                @6xl:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]`
              )}
            >
              {files.slice(0, nextPage).map((file: CloudinaryFile) => (
                <AdvancedRadio
                  key={file.public_id}
                  name="image"
                  value={file.secure_url}
                >
                  <FileCard file={file} />
                </AdvancedRadio>
              ))}
            </RadioGroup>

            {nextPage < files?.length && (
              <div className="mb-4 mt-5 flex flex-col items-center xs:pt-6 sm:pt-8">
                <Button
                  isLoading={isLoadingMore}
                  onClick={() => handleLoadMore()}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default FileGrid;
