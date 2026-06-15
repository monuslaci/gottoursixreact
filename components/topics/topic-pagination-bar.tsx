"use client";

import { Button, Pagination } from "@heroui/react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

type TopicPaginationBarProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function TopicPaginationBar({
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
}: TopicPaginationBarProps) {
  if (totalPages <= 1) {
    return null;
  }

  const firstItem = Math.min((page - 1) * pageSize + 1, totalItems);
  const lastItem = Math.min(page * pageSize, totalItems);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <div className="internal-card rounded-2xl p-3 backdrop-blur sm:p-4">
      <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            className="min-w-[88px] cursor-pointer"
            variant="flat"
            startContent={<ChevronsLeft className="h-4 w-4" />}
            isDisabled={isFirstPage}
            onPress={() => onPageChange(1)}
          >
            First
          </Button>
          <Button
            className="min-w-[88px] cursor-pointer"
            variant="flat"
            isDisabled={isFirstPage}
            onPress={() => onPageChange(Math.max(1, page - 1))}
          >
            Previous
          </Button>

          <span className="rounded-full border border-divider/70 bg-background/70 px-3 py-2 text-sm font-medium text-default-600">
            Page {page} of {totalPages}
          </span>

          <Pagination
            page={page}
            total={totalPages}
            radius="full"
            showControls={false}
            classNames={{
              base: "cursor-default",
              wrapper: "gap-1.5",
              item: "h-10 min-w-10 cursor-pointer rounded-full border border-divider/70 bg-background/60 text-sm font-medium text-default-700 transition hover:border-primary/35 hover:bg-primary/10",
              cursor:
                "h-10 min-w-10 cursor-pointer rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-sm",
            }}
            onChange={onPageChange}
          />

          <Button
            className="min-w-[88px] cursor-pointer"
            variant="flat"
            isDisabled={isLastPage}
            onPress={() => onPageChange(Math.min(totalPages, page + 1))}
          >
            Next
          </Button>
          <Button
            className="min-w-[88px] cursor-pointer"
            variant="flat"
            endContent={<ChevronsRight className="h-4 w-4" />}
            isDisabled={isLastPage}
            onPress={() => onPageChange(totalPages)}
          >
            Last
          </Button>

          <p className="px-2 text-center text-sm font-medium text-default-500">
            Showing {firstItem}-{lastItem} of {totalItems}
          </p>
        </div>
      </div>
    </div>
  );
}
