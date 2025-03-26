"use client";

import { Button, Loader } from "rizzui";
import { useGrid } from "@/app/shared/file/manager/file-grid/use-grid";
import Grid from "@/app/shared/file/manager/file-grid/grid";
import FileGridFilters from "../file-grid-filter";
import { CloudinaryFile } from "@/data/cloudinary-files";

const tableDataPerPage = 30;

export default function FileGrid({
  files,
}: {
  files: CloudinaryFile[] | [];
}) {

  const {
    isLoading,
    paginatedData,
    remainingItems,
    searchTerm,
    handleDelete,
    handleSearch,
    handleLoadMore,
  } = useGrid(files, tableDataPerPage);

  if (isLoading) {
    return (
      <div className="grid h-32 flex-grow place-content-center items-center">
        <Loader variant="spinner" size="xl" />
      </div>
    );
  }


  return (
    <>
      <FileGridFilters onSearch={handleSearch} searchTerm={searchTerm} />
      <Grid data={paginatedData} onDeleteItem={handleDelete} />
      {remainingItems > 0 && (
        <div className="mt-5 flex flex-col items-center xs:mt-6 sm:mt-8">
          <Button isLoading={isLoading} onClick={() => handleLoadMore()}>
            Load More
          </Button>
        </div>
      )}
    </>
  );
}
