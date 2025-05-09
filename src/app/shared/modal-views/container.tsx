"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Modal } from "rizzui";
import { useModal } from "@/app/shared/modal-views/use-modal";

export default function GlobalModal() {
  const { closeModal, modals } = useModal();
  const pathname = usePathname();
  useEffect(() => {
    closeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {modals.map((modal, index) => (
        <Modal
          key={index}
          isOpen={modal.isOpen}
          onClose={closeModal}
          customSize={modal.customSize}
          size={modal.size}
          overlayClassName="backdrop-blur-sm dark:bg-opacity-40 dark:backdrop-blur-lg"
          containerClassName="dark:bg-gray-100"
          className="z-[9999] [&_.pointer-events-none]:overflow-visible "

        >
          {modal.view}
        </Modal>
      ))}
    </>
  );
}


// "use client";

// import { useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { Modal } from "rizzui";
// import { useModal } from "@/app/shared/model-views/use-modal";

// export default function GlobalModal() {
//   const { isOpen, view, closeModal, customSize, size } = useModal();
//   const pathname = usePathname();
//   useEffect(() => {
//     closeModal();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [pathname]);

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={closeModal}
//       customSize={customSize}
//       size={size}
//       overlayClassName="dark:bg-opacity-40 dark:backdrop-blur-lg"
//       containerClassName="dark:bg-gray-100"
//       className="z-[9999] [&_.pointer-events-none]:overflow-visible"
//     >
//       {view}
//     </Modal>
//   );
// }

